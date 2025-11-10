import {
  addTimingApi,
  fetchTimingsApi,
  updateStatusOrDeleteTimingApi,
  updateTimingApi,
} from '@/api/atop';
import {
  EntityId,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { DEFAULT_TIMING_CATEGORY } from '@/constant';
import dayjs from 'dayjs';
import { getDevInfo } from '@ray-js/ray';
import { uiToDeviceLoops, deviceToUiLoops } from '@/utils';

export type Timer = IAndSingleTime & {
  time: string;
  id: number;
  dps: string;
};

type AddTimerPayload = {
  time: string;
  loops: string;
  actions: any;
  dps: string;
  aliasName: string;
  isAppPush: boolean;
};

const timingsAdapter = createEntityAdapter<Timer>({
  sortComparer: (a, b) => (dayjs(a.time, 'HH:mm').isBefore(dayjs(b.time, 'HH:mm')) ? -1 : 1),
});

export const fetchTimings = createAsyncThunk<Timer[]>('timings/fetchTimings', async () => {
  const { timers } = await fetchTimingsApi();

  return (timers as any[]).map(t => ({ ...t, loops: deviceToUiLoops(t.loops) })) as Timer[];
});

export const addTiming = createAsyncThunk('timings/addTiming', async (param: AddTimerPayload) => {
  const { groupId: devGroupId, devId } = getDevInfo();
  const defaultParams = {
    bizId: devGroupId || devId,
    bizType: devGroupId ? '1' : '0',
    isAppPush: false,
    category: DEFAULT_TIMING_CATEGORY,
  };
  const params = { ...defaultParams, ...param, loops: uiToDeviceLoops(param.loops) };
  const id = await addTimingApi(params);
  return { id, status: 1, ...param };
});

export const updateTiming = createAsyncThunk(
  'timings/updateTiming',
  async (param: AddTimerPayload & { id: number }) => {
    const { groupId: devGroupId, devId } = getDevInfo();
    const defaultParams = {
      bizId: devGroupId || devId,
      bizType: devGroupId ? '1' : '0',
      isAppPush: false,
      category: DEFAULT_TIMING_CATEGORY,
    };
    const params = { ...defaultParams, ...param, loops: uiToDeviceLoops(param.loops) };
    await updateTimingApi(params);
    return { id: param.id, changes: param };
  }
);

export const deleteTiming = createAsyncThunk('timings/deleteTiming', async (id: number) => {
  console.log('[deleteTiming] 请求参数 id:', id);
  // status 2 --- 删除
  await updateStatusOrDeleteTimingApi({ ids: String(id), status: 2 });
  console.log('[deleteTiming] 删除成功，返回 id:', id);
  return id;
});

export const updateTimingStatus = createAsyncThunk(
  'timings/updateTimingStatus',
  async ({ id, status }: { id: number; status: 0 | 1 }) => {
    console.log('[updateTimingStatus] 请求参数:', { id, status });
    // status 0 --- 关闭  1 --- 开启
    await updateStatusOrDeleteTimingApi({ ids: String(id), status });
    const result = { id, changes: { status: status ?? 0 } };
    console.log('[updateTimingStatus] 更新成功，返回:', result);
    return { id, changes: { status: status ?? 0 } };
  }
);

/**
 * Slice
 */
const cloudTimingsSlice = createSlice({
  name: 'cloudTimings',
  initialState: timingsAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchTimings.fulfilled, (state, action) => {
      timingsAdapter.upsertMany(state, action.payload);
    });
    builder.addCase(addTiming.fulfilled, (state, action) => {
      timingsAdapter.upsertOne(state, action.payload);
    });
    builder.addCase(deleteTiming.fulfilled, (state, action) => {
      timingsAdapter.removeOne(state, action.payload);
    });
    builder.addCase(updateTimingStatus.fulfilled, (state, action) => {
      timingsAdapter.updateOne(state, action.payload);
    });
    builder.addCase(updateTiming.fulfilled, (state, action) => {
      timingsAdapter.updateOne(state, action.payload);
    });
  },
});

/**
 * Selectors
 */
const selectors = timingsAdapter.getSelectors((state: any) => state.cloudTimings);
export const {
  selectIds: selectAllTimingIds,
  selectAll: selectAllTimings,
  selectTotal: selectTimingsTotal,
  selectById: selectTimingById,
  selectEntities: selectTimingEntities,
} = selectors;

export const selectSpecificTimingIds: (state: any, dpCode: any) => EntityId[] = createSelector(
  [selectAllTimingIds, selectTimingEntities, (state: any, dpCode: any) => dpCode],
  (ids, entities, dpCode) => {
    return ids.filter(id => {
      const timing = entities[id];

      return timing ? getDevInfo().codeIds[dpCode] in JSON.parse(timing.dps) : false;
    });
  }
);

export default cloudTimingsSlice.reducer;
