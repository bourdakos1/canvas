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
module.exports = {
	extends: [
		"eslint-config-canvas/react"
	].map(require.resolve),
	env: {
		"browser": true
	},
	rules: {
		// Disable strict warning on ES6 Components
		"sort-imports": 0,
		"react/jsx-indent-props": [2, "tab"],
		"no-unused-expressions": 0,
		"no-shadow": ["error", { "allow": ["expect"] }]
	}
};
