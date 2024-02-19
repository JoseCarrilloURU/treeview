class TreeView extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
   async connectedCallback() {
      // The data for the tree
      const response = await fetch('./data.json');
        const data = await response.json();
  
      // Create the root list
      const ul = document.createElement('ul');
      this.shadowRoot.appendChild(ul);
  
      // Create the tree
      data.forEach(item => {
        ul.appendChild(this.createNode(item));
      });
    }
  
    createNode(item) {
      // Create the list item
      const li = document.createElement('li');
      li.className = 'collapsed'; // Initially set the node to the collapsed state
  
      // Create the checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      li.appendChild(checkbox);
  
      // Create the icon
      const icon = document.createElement('i');
      li.appendChild(icon);
  
      // Add the item name
      const text = document.createTextNode(item.name);
      li.appendChild(text);
  
      // If the item has children, create a nested list
      if (item.children && item.children.length > 0) {
        const ul = document.createElement('ul');
        item.children.forEach(child => {
          ul.appendChild(this.createNode(child));
        });
        li.appendChild(ul);
      } else {
        // If there are no children, add an [Empty] text node
        const empty = document.createElement('ul');
        empty.textContent = '[Empty]';
        li.appendChild(empty);
      }
  
      // Add an event listener to the list item to toggle its expanded/collapsed state
      li.addEventListener('click', event => {
        if (li.className === 'collapsed' && li.getElementsByTagName('ul').length > 0) {
          li.className = 'expanded';
        } else if (li.className === 'expanded') {
          li.className = 'collapsed';
        }
        event.stopPropagation(); // Prevent the event from bubbling up to parent nodes
      });
  
      // Add an event listener to the checkbox to stop the click event from bubbling up to the list item
      checkbox.addEventListener('click', event => {
        event.stopPropagation();
  
        // Check or uncheck all child checkboxes
        const childCheckboxes = li.getElementsByTagName('input');
        for (let i = 0; i < childCheckboxes.length; i++) {
          childCheckboxes[i].checked = checkbox.checked;
        }
  
        // Check or uncheck the parent checkbox based on the child checkboxes
        const parentCheckbox = li.parentElement.parentElement.querySelector('input');
        if (parentCheckbox) {
          const siblingCheckboxes = li.parentElement.querySelectorAll('input');
          parentCheckbox.checked = Array.from(siblingCheckboxes).every(checkbox => checkbox.checked);
          parentCheckbox.indeterminate = Array.from(siblingCheckboxes).some(checkbox => checkbox.checked) && !parentCheckbox.checked;
        }
      });
  
      return li;
    }
  }
  
  // Define the custom element
  customElements.define('tree-view', TreeView);

        // Fetch data from a local file
       /* fetch("data.json")
          .then((response) => response.json())
          .then((data) => {
            // Get the root element for the treeview
            const treeRoot = this.shadowRoot.getElementById("tree-root");*/
