/*
 * Copyright 2017-2020 Elyra Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint arrow-body-style: ["off"] */

import { NODE_LINK, COMMENT_LINK } from "../../../common-canvas/constants/canvas-constants.js";

export default (state = [], action) => {
	switch (action.type) {
	case "DELETE_SUPERNODES":
		return state.filter((link) => {
			const removeLink = action.data.supernodesToDelete.some((sn) => {
				return (link.srcNodeId === sn.id || // If node being deleted is either source or target of link remove this link
					link.trgNodeId === sn.id);
			});
			return !removeLink;
		});

	case "DELETE_OBJECT":
		return state.filter((link) => {
			return (link.srcNodeId !== action.data.id && // If node being deleted is either source or target of link remove this link
				link.trgNodeId !== action.data.id);
		});

	case "ADD_LINK": {
		const newLink = {
			id: action.data.id,
			class_name: action.data.class_name,
			srcNodeId: action.data.srcNodeId,
			trgNodeId: action.data.trgNodeId,
			type: action.data.type,
			decorations: action.data.decorations,
			style: action.data.style,
			style_temp: action.data.style_temp
		};

		if (action.data.type === NODE_LINK) {
			Object.assign(newLink, {
				"srcNodePortId": action.data.srcNodePortId,
				"trgNodePortId": action.data.trgNodePortId,
				"srcPos": action.data.srcPos,
				"trgPos": action.data.trgPos,
				"linkName": action.data.linkName,
				"typeAttr": action.data.typeAttr,
				"description": action.data.description
			});
		}
		return [
			...state,
			newLink
		];
	}

	case "MOVE_OBJECTS":
		return state.map((link) => {
			if (action.data.links) {
				const index = action.data.links.findIndex((l) => l.id === link.id);
				if (index > -1) {
					const newLink = Object.assign({}, link);
					if (newLink.srcPos) {
						newLink.srcPos.x_pos += action.data.offsetX;
						newLink.srcPos.y_pos += action.data.offsetY;
					}
					if (newLink.trgPos) {
						newLink.trgPos.x_pos += action.data.offsetX;
						newLink.trgPos.y_pos += action.data.offsetY;
					}
				}
			}
			return link;
		});

	case "SET_LINK_PROPERTIES":
		return state.map((link) => {
			if (link.id === action.data.linkId) {
				return Object.assign({}, link, action.data.linkProperties);
			}
			return link;
		});

	case "SET_LINK_SRC_INFO":
		return state.map((link) => {
			if (link.id === action.data.linkId) {
				const newLink = Object.assign({}, link);
				delete newLink.srcNodeId;
				delete newLink.srcNodePortId;
				delete newLink.srcPos;
				newLink.srcNodeId = action.data.srcNodeId;
				if (action.data.srcNodePortId) {
					newLink.srcNodePortId = action.data.srcNodePortId;
				}
				return newLink;
			}
			return link;
		});

	case "SET_LINK_TRG_INFO":
		return state.map((link) => {
			if (link.id === action.data.linkId) {
				const newLink = Object.assign({}, link);
				delete newLink.trgNodeId;
				delete newLink.trgNodePortId;
				delete newLink.trgPos;
				newLink.trgNodeId = action.data.trgNodeId;
				if (action.data.trgNodePortId) {
					newLink.trgNodePortId = action.data.trgNodePortId;
				}
				return newLink;
			}
			return link;
		});

	case "DELETE_LINK":
		return state.filter((link) => {
			return link.id !== action.data.id;
		});

	case "DELETE_LINKS": {
		return state.filter((link) => {
			return action.data.linksToDelete.findIndex((delLnk) => link.id === delLnk.id) === -1;
		});
	}

	case "UPDATE_LINK": {
		return state.map((link) => {
			if (link.id === action.data.link.id) {
				const newLink = Object.assign({}, link, action.data.link);
				// Each link can only have either srcNodeId/srcNodePortId or srcPos so
				// ensure the one is deleted in the presence of the other.
				if (action.data.link.srcPos) {
					delete newLink.srcNodeId;
					delete newLink.srcNodePortId;
				} else if (action.data.link.srcNodeId) {
					delete newLink.srcPos;
				}
				// Each link can only have either trgNodeId/trgNodePortId or trgPos so
				// ensure the one is deleted in the presence of the other.
				if (action.data.link.trgPos) {
					delete newLink.trgNodeId;
					delete newLink.trgNodePortId;
				} else if (action.data.link.trgNodeId) {
					delete newLink.trgPos;
				}
				return newLink;
			}
			return link;
		});
	}

	case "SET_LINKS_CLASS_NAME":
		return state.map((link) => {
			const idx = action.data.linkIds.indexOf(link.id);
			if (idx > -1) {
				const newLink = Object.assign({}, link);
				newLink.class_name =
					Array.isArray(action.data.newClassName) ? action.data.newClassName[idx] : action.data.newClassName;
				return newLink;
			}
			return link;
		});

	case "SET_LINKS_STYLE":
		return state.map((link) => {
			if (action.data.objIds.indexOf(link.id) > -1) {
				const newLink = Object.assign({}, link);
				if (action.data.temporary) {
					newLink.style_temp = action.data.newStyle;
				} else {
					newLink.style = action.data.newStyle;
				}
				return newLink;
			}
			return link;
		});

	case "SET_LINKS_MULTI_STYLE":
		return state.map((link) => {
			const pipelineObjStyle =
				action.data.pipelineObjStyles.find((entry) => entry.pipelineId === action.data.pipelineId && entry.objId === link.id);
			if (pipelineObjStyle) {
				const newLink = Object.assign({}, link);
				const style = pipelineObjStyle && pipelineObjStyle.style ? pipelineObjStyle.style : null;
				if (action.data.temporary) {
					newLink.style_temp = style;
				} else {
					newLink.style = style;
				}
				return newLink;
			}
			return link;
		});

	case "SET_LINK_DECORATIONS":
		return state.map((link, index) => {
			if (action.data.linkId === link.id) {
				const newLink = Object.assign({}, link);
				newLink.decorations = action.data.decorations;
				return newLink;
			}
			return link;
		});

	case "SET_LINKS_MULTI_DECORATIONS":
		return state.map((link) => {
			const pipelineLinkDec =
				action.data.pipelineLinkDecorations.find((entry) => entry.pipelineId === action.data.pipelineId && entry.linkId === link.id);
			if (pipelineLinkDec) {
				const newLink = Object.assign({}, link, { decorations: pipelineLinkDec.decorations });
				return newLink;
			}
			return link;
		});

	case "REMOVE_ALL_STYLES":
		return state.map((link) => {
			if (action.data.temporary && link.style_temp) {
				const newLink = Object.assign({}, link);
				delete newLink.style_temp;
				return newLink;
			} else if (!action.data.temporary && link.style) {
				const newLink = Object.assign({}, link);
				delete newLink.style;
				return newLink;
			}
			return link;
		});


	// When a comment is added, links have to be created from the comment
	// to each of the selected nodes.
	case "ADD_COMMENT": {
		const createdLinks = [];
		action.data.selectedObjectIds.forEach((objId, i) => {
			createdLinks.push({
				id: action.data.linkIds[i],
				srcNodeId: action.data.id,
				trgNodeId: action.data.selectedObjectIds[i],
				type: COMMENT_LINK
			});
		});
		return [
			...state,
			...createdLinks
		];
	}

	default:
		return state;
	}
};
