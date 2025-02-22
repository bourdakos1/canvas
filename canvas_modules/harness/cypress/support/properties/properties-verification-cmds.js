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

Cypress.Commands.add("verifyReadOnlyTextValue", (propertyId, value) => {
	cy.get("div[data-id='properties-" + propertyId + "'] span")
		.invoke("text")
		.then((text) => {
			expect(value).equal(text);
		});
});

Cypress.Commands.add("verifyReadOnlyTextCSS", (propertyId, style, value) => {
	cy.get("div[data-id='properties-" + propertyId + "'] span")
		.should("have.css", style, value);
});

Cypress.Commands.add("verifyNoTextOverflow", (propertyId) => {
	cy.get("div[data-id='properties-" + propertyId + "'] span")
		.invoke("height")
		.should("be.lt", 25);
});

Cypress.Commands.add("verifyPropertiesFlyoutTitle", (givenTitle) => {
	cy.get(".properties-title-editor-input input")
		.should("have.value", givenTitle);
});

Cypress.Commands.add("verifyPropertiesFlyoutDoesNotExist", () => {
	cy.get("#node-title-editor-right-flyout-panel")
		.should("not.exist");
});

/** Verify the tooltip over the given text is 'visible'
* @param label: label of the container shown in the UI
* @param text: text shown in the tip
*/
Cypress.Commands.add("verifyTipForLabelIsVisibleAtLocation", (label, tipLocation, text) => {
	// Verify the tip for label "Mode" is visible on the "top" with text "Include or discard rows"
	cy.getControlContainerFromName(label)
		.then((container) => {
			cy.get(".common-canvas-tooltip")
				.then((tips) => {
					// Get the visible tip
					let visibleTip;
					for (var idx = 0; idx < tips.length; idx++) {
						if (tips[idx].textContent === text) {
							visibleTip = tips[idx];
							break;
						}
					}

					if (visibleTip) {
						// Verify tip is visible
						cy.wrap(visibleTip).should("have.attr", "aria-hidden", "false");
						// Verify text in tip
						cy.wrap(visibleTip).should("have.text", text);
						// Verify tip location
						/* TODO: visibleTip has style="left: 1105.24px; top: 258.722px;"
						* Get these values of left and top and store in tipLeft and tipTop.
						* Need to write loop for "top" comparing containerTop and tipTop
						*/
						const containerLeft = container[0].getBoundingClientRect().x;
						const tipLeft = visibleTip.getBoundingClientRect().x;
						if (tipLocation === "left") {
							expect(tipLeft).to.be.lessThan(containerLeft);
						} else if (tipLocation === "right") {
							expect(tipLeft).to.be.greaterThan(containerLeft);
						}
					}
				});
		});
});

/** Verify the tooltip over the given text is 'hidden'
* @param label: label of the container shown in the UI
* @param text: text shown in the tip
*/
Cypress.Commands.add("verifyTipForLabelIsHidden", (label, text) => {
	cy.getControlContainerFromName(label)
		.then((container) => {
			cy.get(".common-canvas-tooltip")
				.then((tips) => {
					// Get the tip
					let hiddenTip;
					for (var idx = 0; idx < tips.length; idx++) {
						if (tips[idx].textContent === text) {
							hiddenTip = tips[idx];
							break;
						}
					}

					if (hiddenTip) {
						// Verify tip is hidden
						cy.wrap(hiddenTip).should("be.hidden");
					}
				});
		});
});

/** Verify the tooltip over the given text in the summaryPanel is 'visible'
* @param text: value displayed in summary panels
* @param summaryName: name of summaryPanel
* @param visible: string value of 'visible' when tooltip is showing, other values for tooltip hidden
*/
Cypress.Commands.add("verifyTipWithTextInSummaryPanel", (text, summaryName, visible) => {
	cy.getSummaryFromName(summaryName)
		.then((summary) => {
			cy.get(".common-canvas-tooltip")
				.then((tips) => {
					// Get the visible tip
					let visibleTip;
					for (var idx = 0; idx < tips.length; idx++) {
						if (tips[idx].textContent === text) {
							visibleTip = tips[idx];
							break;
						}
					}

					if (visibleTip) {
						// Verify tip is visible or hidden
						if (visible === "visible") {
							cy.wrap(visibleTip).should("have.attr", "aria-hidden", "false");
						} else if (visible === "hidden") {
							cy.wrap(visibleTip).should("have.attr", "aria-hidden", "true");
						}
						// Verify text in tip
						cy.wrap(visibleTip).should("have.text", text);
						// Verify tip location
						/* TODO: visibleTip has style="left: 1105.24px; top: 258.722px;"
						* Get these values of left and top and store in tipLeft and tipTop.
						* Fix the commented code below.
						*/
						const summaryTop = summary[0].getBoundingClientRect().y;
						const tipTop = visibleTip.getBoundingClientRect().y;
						expect(tipTop).to.be.greaterThan(summaryTop);
						// const summaryLeft = summary[0].getBoundingClientRect().x;
						// const tipLeft = visibleTip.getBoundingClientRect().x;
						// expect(tipLeft).to.be.greaterThan(summaryLeft);
					}
				});
		});
});

Cypress.Commands.add("verifyTipForValidationIconInSummaryPanel", (summaryPanelId, text) => {
	cy.findValidationIconInSummaryPanel(summaryPanelId)
		.then((validationIcon) => {
			cy.get(".common-canvas-tooltip")
				.then((tips) => {
					// Get the visible tip
					let visibleTip;
					for (var idx = 0; idx < tips.length; idx++) {
						if (tips[idx].textContent === text) {
							visibleTip = tips[idx];
							break;
						}
					}

					if (visibleTip) {
						// Verify tip is visible
						cy.wrap(visibleTip).should("have.attr", "aria-hidden", "false");
						// Verify text in tip
						cy.wrap(visibleTip).should("have.text", text);
						// Verify tip location
						/* TODO: visibleTip has style="left: 1223.23px; top: 224.972px;"
						* Get these values of left and top and store in tipLeft and tipTop.
						* Fix the commented code below.
						*/
						const validationIconTop = validationIcon[0].getBoundingClientRect().y;
						const tipTop = visibleTip.getBoundingClientRect().y;
						expect(tipTop).to.be.greaterThan(validationIconTop);

						// const validationIconLeft = validationIcon[0].getBoundingClientRect().x;
						// const tipLeft = visibleTip.getBoundingClientRect().x;
						// expect(tipLeft).to.be.greaterThan(validationIconLeft);
					}
				});
		});
});

// Expression control verification commands
Cypress.Commands.add("verifyTypeOfWordInExpressionEditor", (word, type, propertyId) => {
	// Verify "is_real" is a "keyword" in ExpressionEditor
	const searchClass = ".cm-" + type;
	const testWord = (type === "string") ? "\"" + word + "\"" : word;
	cy.get(`div[data-id='properties-ctrl-${propertyId}']`)
		.find(".properties-expression-editor")
		.find(".CodeMirror-line")
		.then((codeMirrorLine) => {
			for (let idx = 0; idx < codeMirrorLine.length; idx++) {
				if (codeMirrorLine[idx].textContent.includes(testWord)) {
					cy.wrap(codeMirrorLine[idx])
						.find(searchClass)
						.eq(0)
						.should("have.class", "cm-" + type)
						.should("have.text", testWord);
					break;
				}
			}
		});
});

Cypress.Commands.add("verifyNumberOfHintsInExpressionEditor", (hintCount) => {
	// Enter "is" in ExpressionEditor and press autocomplete and verify that 18 autocomplete hints are displayed
	cy.get(".CodeMirror-hints")
		.eq(0)
		.find("li")
		.should("have.length", hintCount);
});

Cypress.Commands.add("verifyTypeOfSelectedAutoComplete", (selectedText, type) => {
	const searchClass = ".cm-" + type;
	cy.get(".properties-expression-editor")
		.find(".CodeMirror-line")
		.find(searchClass)
		.should("have.class", "cm-" + type)
		.should("have.text", selectedText);
});

Cypress.Commands.add("verifyTypeOfEnteredTextInExpressionEditor", (enteredText, type, propertyId) => {
	// Enter "and" in ExpressionEditor and verify it is a "keyword"
	const setText = (type === "string") ? "\"" + enteredText + "\"" : enteredText;
	cy.enterTextInExpressionEditor(setText, propertyId)
		.then((text) => {
			const searchClass = ".cm-" + type;
			cy.get(".properties-expression-editor")
				.find(".CodeMirror-line")
				.find(searchClass)
				.should("have.class", "cm-" + type)
				.should("have.text", setText);
		});
});

Cypress.Commands.add("verifyPlaceholderTextInExpressionEditor", (text) => {
	cy.get(".properties-expression-editor")
		.find(".CodeMirror-placeholder")
		.should("have.text", text);
});

Cypress.Commands.add("verifyValidationMessage", (message) => {
	cy.get(".properties-validation-message > span")
		.first()
		.should("have.text", message);
});

Cypress.Commands.add("verifyControlIsDisplayed", (propertyId) => {
	cy.get(`div[data-id='properties-ci-${propertyId}']`)
		.should("exist");
});

Cypress.Commands.add("verifyValueInSummaryPanelForCategory", (value, summaryName, rowNumber, categoryName) => {
	cy.get(".right-flyout-panel")
		.find(".properties-category-container")
		.find(".properties-category-title")
		.contains(categoryName)
		.should("exist");

	cy.getSummaryFromName(summaryName)
		.find(".properties-summary-row")
		.eq(rowNumber - 1)
		.find(".properties-summary-row-data ")
		.eq(1)
		.invoke("text")
		.then((text) => expect(text.trim()).to.equal(value));
});

Cypress.Commands.add("verifyIconInSubPanel", (iconName) => {
	if (iconName === "none") {
		cy.getValidateIconInSubPanel()
			.should("not.exist");
	} else {
		cy.getValidateIconInSubPanel()
			.find("svg")
			.invoke("attr", "class")
			.then((iconClass) => {
				expect(iconClass).to.include(iconName);
			});
	}
});

Cypress.Commands.add("verifyRowInSelectColumnsTable", (propertyId, fieldName, rowNumber) => {
	cy.get(`div[data-id='properties-ft-${propertyId}']`)
		.find("div[data-role='properties-data-row']")
		.eq(rowNumber - 1)
		.find(".properties-readonly")
		.should("have.text", fieldName);
});

Cypress.Commands.add("verifyFieldIsSelectedInFieldPickerPanel", (fieldName, dataType, panelName) => {
	// Following logic works based on assumption  - fieldName in each row is unique
	let rowNumber;
	cy.getWideFlyoutPanel(panelName)
		.find("div[data-role='properties-data-row']")
		.each(($el, index) => {
			if ($el[0].childNodes[1].textContent === fieldName) {
				rowNumber = index;
				return false;
			}
		})
		.then((rows) => {
			cy.wrap(rows)
				.eq(rowNumber)
				.then((row) => {
					// Verify field name
					cy.wrap(row)
						.find(".properties-fp-field-name")
						.should("have.text", fieldName);
					// Verify dataType
					cy.wrap(row)
						.find(".properties-fp-field-type")
						.should("have.text", dataType);
					// Verify checkbox is selected
					cy.wrap(row)
						.find(".properties-vt-row-checkbox")
						.find("input")
						.should("be.checked");
				});
		});
});

Cypress.Commands.add("verifyFieldsInTable", (propertyId, fields, rowNumber, columnNumber) => {
	cy.get(`div[data-id='properties-ft-${propertyId}']`)
		.find(`div[data-id='properties-${propertyId}_${rowNumber}_${columnNumber}']`)
		.should("have.text", fields);
});

Cypress.Commands.add("verifyHeightOfTable", (propertyId, height) => {
	cy.get(`div[data-id='properties-ft-${propertyId}']`)
		.find(".properties-ft-container-wrapper")
		.find("div[role='rowgroup']")
		.invoke("css", "height")
		.then((cssValue) => {
			cy.verifyPixelValueInCompareRange(height, cssValue);
		});
});
