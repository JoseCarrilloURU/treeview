class TreeView2 extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(
      document.getElementById("tree-view-template").content.cloneNode(true)
    );
    this.buildTree();
  }

  buildTree() {
    // Data for the treeview
    const data = {
      name: "Treeview (JS)",
      children: [
        {
          name: "Parent 1",
          children: [
            { name: "Child 1.1" },
            { name: "Child 1.2" },
            { name: "Child 1.3" },
          ],
        },
        {
          name: "Parent 2",
          children: [
            { name: "Child 2.1" },
            { name: "Child 2.2" },
            { name: "Child 2.3" },
          ],
        },
        {
          name: "Parent 3",
          children: [
            { name: "Child 3.1" },
            { name: "Child 3.2", children: [
                { name: "Grandchild 3.2.1" },
        ],
        },
            { name: "Child 3.3" },
          ],
        },
      ],
    };

    // Get the root element for the treeview
    const treeRoot = this.shadowRoot.getElementById("tree-root");

    // Function to create HTML for a tree node
    function createNode(item) {
      // Create the list item
      const li = document.createElement("li");
      li.className = "collapsed"; // Initially set the node to the collapsed state

      // Create the checkbox
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      li.appendChild(checkbox);

      // If the item has children, create a nested list
      if (item.children && item.children.length > 0) {
        const icon = document.createElement("i");
        li.appendChild(icon);

        const text = document.createTextNode(item.name);
        li.appendChild(text);

        const ul = document.createElement("ul");
        item.children.forEach((child) => {
          ul.appendChild(createNode(child));
        });
        li.appendChild(ul);
        li.className = "collapsed";
        li.addEventListener("click", (event) => {
          if (li.className === "collapsed") {
            li.className = "expanded";
          } else if (li.className === "expanded") {
            li.className = "collapsed";
          }
          event.stopPropagation(); // Prevent the event from bubbling up to parent nodes
        });
      } else {
        // Add the item name
        const text = document.createTextNode(item.name);
        li.appendChild(text);
      }

      // Add an event listener to the checkbox to stop the click event from bubbling up to the list item
      checkbox.addEventListener("click", (event) => {
        event.stopPropagation();

        // Check or uncheck all child checkboxes
        const childCheckboxes = li.getElementsByTagName("input");
        for (let i = 0; i < childCheckboxes.length; i++) {
          childCheckboxes[i].checked = checkbox.checked;
        }

        checkbox.addEventListener("change", function () {
          const childCheckboxes = li.querySelector("input");
          for (let i = 0; i < childCheckboxes.length; i++) {
            childCheckboxes[i].checked = checkbox.checked;
          }
          updateParentCheckboxes(li);
        });
      });

      

      return li;
    }

    // Build the tree using the data
    const rootNode = createNode(data);
    treeRoot.appendChild(rootNode);

    function updateParentCheckboxes(element) {
        const parentLi = element.parentElement.parentElement;
        if (parentLi) {
          const parentCheckbox = parentLi.querySelector('input[type="checkbox"]');
          if (parentCheckbox) {
            const siblingCheckboxes = parentLi.querySelectorAll(":scope > ul > li > input");
            parentCheckbox.checked = Array.from(siblingCheckboxes).every(
              (checkbox) => checkbox.checked
            );
            parentCheckbox.indeterminate =
              Array.from(siblingCheckboxes).some(
                (checkbox) => checkbox.checked
              ) && !parentCheckbox.checked;
            updateParentCheckboxes(parentLi);
          }
        }
      }
    } 
    }

    // Define the new element
customElements.define("tree-view2", TreeView2);