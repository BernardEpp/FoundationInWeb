(function(app) {
   'use strict';
   const pageItems = {};

   app.promisesStartup = function() {
      pageItems.loadData = document.getElementById('loadData');
      pageItems.waitIndicator = document.getElementById('wait-indicator');

      pageItems.loadData.addEventListener('click', uploadDataToApi);
   }

   app.todoStartup = function() {
      const frm = document.getElementById('taskForm');
      pageItems.taskList = document.getElementById('taskList');
      pageItems.taskInput = frm.querySelector('#taskInput');
      pageItems.submit = frm.querySelector('#submit');
      pageItems.removeButton = frm.querySelector('#remove');

      pageItems.submit.addEventListener('click', addTask);
      pageItems.taskList.addEventListener('click', completeTask);
      pageItems.removeButton.addEventListener('click', removeCompletedTasks);

      loadFromStorage();
   };

   function uploadDataToApi(e) {
      const data = {
         firstName: 'Tim',
         lastName: 'Corey',
         isAlive: true
      };

      fetch('https://webhook.site/', {
         method: 'POST',
         mode: 'no-cors',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(data)
      })
      .then(
         response => console.log(response),
         reason => console.error(reason)
      );
   }

   function loadApiData(e) {
      fetch('https://swapi.dev/api/people/1')
         .then(response => {
            console.log(response);
            return response.json();
         })
         .then(data => console.log(data))
         .catch(reason => console.error(reason));
   }

   function loadFromStorage() {
      const itemsString = localStorage.getItem('taskList');

      if (itemsString !== null) {
         const items = JSON.parse(itemsString);
         items.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item.task;
            if (item.isComplete) {
               li.classList.add('completed-task');
            }
            pageItems.taskList.appendChild(li);
         });
      }
   }

   function saveToStorage() {
      const items = Array.from(pageItems.taskList.children);
      const itemsToSave = items.map(item => {
         return {
            task: item.innerText,
            isComplete: item.classList.contains('completed-task')
         };
      });

      localStorage.setItem('taskList', JSON.stringify(itemsToSave));
   }

   function removeCompletedTasks(e) {
      e.preventDefault();

      const items = Array.from(pageItems.taskList.children);

      items.forEach(el => {
         if (el.classList.contains('completed-task')){
            pageItems.taskList.removeChild(el);
         }
      });
      saveToStorage();
   }

   function completeTask(e) {
      if (e.target.classList.contains('completed-task')) {
         e.target.classList.remove('completed-task');
      } else {
         e.target.classList.add('completed-task');
      }
      saveToStorage();
   }

   function addTask(e) {
      e.preventDefault();

      const li = document.createElement('li');
      li.innerText = pageItems.taskInput.value;
      pageItems.taskList.appendChild(li);
      pageItems.taskInput.value = '';
      saveToStorage();
   }
})(window.app = window.app || {});