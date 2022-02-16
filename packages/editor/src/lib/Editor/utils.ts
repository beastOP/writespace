/* eslint-disable @typescript-eslint/no-explicit-any */
export function generate_paragraph() {
	return {
		id: Math.floor(Math.random() * 100),
		type: 'paragraph',
		data: {
			text: ''
		}
	};
}

export function generate_heading() {
	return {
		id: Math.floor(Math.random() * 100),
		type: 'heading',
		data: {
			text: ''
		}
	};
}

export function generate_list() {
	return {
		id: Math.floor(Math.random() * 100),
		type: 'list',
		data: {
			0: ''
		}
	};
}

export function generate_image() {
	return {
		id: Math.floor(Math.random() * 100),
		type: 'image',
		data: {
			src: ''
		}
	};
}

export const get_last_element = (arr: string | any[]) => arr[arr.length - 1];

export const add_at = (arr: string | any[], index: any, newItem: any) => [
	// part of the array before the specified index
	...arr.slice(0, index),
	// inserted item
	newItem,
	// part of the array after the specified index
	...arr.slice(index)
];

export const remove_at = (arr: string | any[], index: number) => [
	// part of the array before the specified index
	...arr.slice(0, index),
	// part of the array after the specified index
	...arr.slice(index + 1)
];

//   export function findFirstChildByClass(element, className) {
//     var foundElement = null, found = false;
//     function recurse(element, className, found) {
//         for (var i = 0; i < element.childNodes.length && !found; i++) {
//             var el = element.childNodes[i];
//             var classes = el.className != undefined? el.className.split(" ") : [];
//             for (var j = 0, jl = classes.length; j < jl; j++) {
//                 if (classes[j] == className) {
//                     found = true;
//                     foundElement = element.childNodes[i];
//                     break;
//                 }
//             }
//             if(found)
//                 break;
//             recurse(element.childNodes[i], className, found);
//         }
//     }
//     recurse(element, className, found);
//     return foundElement;
// }

export function setEndOfContenteditable(contentEditableElement: any) {
	let range: Range, selection: Selection;
	if (document.createRange) {
		//Firefox, Chrome, Opera, Safari, IE 9+
		range = document.createRange(); //Create a range (a range is a like the selection but invisible)
		range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
		range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
		selection = window.getSelection(); //get the selection object (allows you to change selection)
		selection.removeAllRanges(); //remove any selections already made
		selection.addRange(range); //make the range you have just created the visible selection
	}
}
