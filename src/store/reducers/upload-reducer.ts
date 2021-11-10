import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  VideoTree,
  VideoInfo,
  VideoStatus,
} from 'store/reducers/video-reducer';
import {
  createNode,
  findById,
  findByChildId,
  getFullSize,
  getMinMaxDuration,
} from 'util/tree';

type TreeType = 'uploadTree' | 'previewTree';

interface UploadSliceState {
  uploadTree: VideoTree | null;
  previewTree: VideoTree | null;
  activeNodeId: string;
  isUploadSaved: boolean;
}

const initialState: UploadSliceState = {
  uploadTree: null,
  previewTree: null,
  activeNodeId: '',
  isUploadSaved: false,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    initiateUpload: (state) => {
      const node = createNode();
      const tree: VideoTree = {
        root: node,
        title: '',
        tags: [],
        description: '',
        size: 0,
        maxDuration: 0,
        minDuration: 0,
        thumbnail: { name: '', url: '' },
        views: 0,
        isEditing: true,
        status: VideoStatus.Public,
      };

      state.uploadTree = tree;
      state.previewTree = tree;
      state.activeNodeId = node.id;
      state.isUploadSaved = true;
    },

    appendNode: (
      state,
      { payload }: PayloadAction<{ type?: TreeType; nodeId: string }>
    ) => {
      let trees = [
        state.uploadTree as VideoTree,
        state.previewTree as VideoTree,
      ];

      if (payload.type) {
        trees = [state[payload.type] as VideoTree];
      }

      const newNode = createNode();

      for (let tree of trees) {
        const node = findById(tree, payload.nodeId);

        if (!node) return;

        newNode.prevId = node.id;
        node.children.push(newNode);

        const fullSize = getFullSize(tree);
        const { max, min } = getMinMaxDuration(tree);

        tree.size = fullSize;
        tree.maxDuration = max;
        tree.minDuration = min;
      }

      state.isUploadSaved = false;
    },

    setNode: (
      state,
      {
        payload,
      }: PayloadAction<{
        type?: TreeType;
        info: { [key in keyof VideoInfo]?: VideoInfo[key] } | null;
        nodeId: string;
      }>
    ) => {
      let trees = [
        state.uploadTree as VideoTree,
        state.previewTree as VideoTree,
      ];

      if (payload.type) {
        trees = [state[payload.type] as VideoTree];
      }

      for (let tree of trees) {
        const node = findById(tree, payload.nodeId);

        if (!node) return;

        if (!node.info) {
          node.info = payload.info as VideoInfo;
        } else {
          if (payload.info === null) {
            node.info = null;
          } else {
            node.info = { ...node.info, ...payload.info };
          }
        }

        const fullSize = getFullSize(tree);
        const { max, min } = getMinMaxDuration(tree);

        tree.size = fullSize;
        tree.maxDuration = max;
        tree.minDuration = min;
      }

      state.isUploadSaved = false;
    },

    removeNode: (
      state,
      { payload }: PayloadAction<{ type?: TreeType; nodeId: string }>
    ) => {
      let trees = [
        state.uploadTree as VideoTree,
        state.previewTree as VideoTree,
      ];

      if (payload.type) {
        trees = [state[payload.type] as VideoTree];
      }

      for (let tree of trees) {
        if (!tree) return;

        const node = findByChildId(tree, payload.nodeId);

        if (!node) return;

        node.children = node.children.filter(
          (item) => item.id !== payload.nodeId
        );

        const fullSize = getFullSize(tree);
        const { max, min } = getMinMaxDuration(tree);

        tree.size = fullSize;
        tree.maxDuration = max;
        tree.minDuration = min;
      }

      state.isUploadSaved = false;
    },

    setTree: (
      state,
      {
        payload,
      }: PayloadAction<{
        type?: TreeType;
        info: { [key in keyof VideoTree]?: VideoTree[key] };
      }>
    ) => {
      switch (payload.type) {
        case 'uploadTree':
          state.uploadTree = {
            ...state.uploadTree,
            ...payload.info,
          } as VideoTree;
          break;
        case 'previewTree':
          state.previewTree = {
            ...state.previewTree,
            ...payload.info,
          } as VideoTree;
          break;
        default:
          state.uploadTree = {
            ...state.uploadTree,
            ...payload.info,
          } as VideoTree;
          state.previewTree = {
            ...state.previewTree,
            ...payload.info,
          } as VideoTree;
      }

      state.isUploadSaved = false;
    },

    setActiveNode: (state, { payload }: PayloadAction<string>) => {
      state.activeNodeId = payload;
    },

    saveUpload: (state) => {
      state.isUploadSaved = true;
    },

    finishUpload: (state) => {
      state.uploadTree = null;
      state.previewTree = null;
      state.activeNodeId = '';
      state.isUploadSaved = false;
    },
  },
});

export const uploadActions = uploadSlice.actions;

export default uploadSlice.reducer;