(function(app) {
   'use strict';
   const pageItems = {};

   app.promisesStartup = function() {
      pageItems.loadData = document.getElementById('loadData');
      pageItems.waitIndicator = document.getElementById('wait-indicator');

      pageItems.loadData.addEventListener('click', loadAsyncData);
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



   async function loadAsyncData(e) {
      try {
         const results1 = await timingDemo('Promise #1');
         console.log(results1);
   
         const results2 = await timingDemo('Promise #2');
         console.log(results2);
      } catch(err) {
         console.error(`There was an error in ${err}`);
      }
      console.log('we are all done');
   }

   function timingDemo(message) {
      return new Promise(function(resolve, reject) {
         setTimeout(() => reject(message), 2000);
      });
   }

   function myOwnSimplePromise(e) {
      const myPromise = new Promise(function(resolve, reject) {
         setTimeout(() => resolve('resolved my own promise'), 2000);
      })
      .then( result => {
         console.log('My promise is done.')
      }
      )
      .finally(
         console.log('My promise is finally done.')
      );
   }

   function loadSimplePromiseData(e) {
      pageItems.waitIndicator.style.display = 'block';
      const promise = new Promise(function(resolve, reject) {
         setTimeout(() => reject('Rejected the promise'), 3000);
      });

      promise
         .then(
            result => console.log(result),
            reason => console.error(reason)
         )
         .finally(() =>{
            console.log('This is now complete');
            pageItems.waitIndicator.style.display = 'none';
         });
   }

   function loadChainedPromiseData(e) {
      pageItems.waitIndicator.style.display = 'block';

      const promise = new Promise(function(resolve, reject) {
         setTimeout(() => resolve('Promise #1'), 3000);
      });

      promise
         .then(result => {
            console.log('Promise #1 succeeded');
            return new Promise(function(resolve, reject) {
               setTimeout(() => reject('Promise #2'), 2000);
            });
         })
         .then(result => {
            console.log('Promise #2 succeeded');
         })
         .catch(reason => {
            console.error(`We had a promise failure at ${reason}`);
         })
         // .then(result => {
         //    console.log('Promise after the catch succeeded');
         // })
         .finally(() => {
            console.log('We have now completed all promises');
            pageItems.waitIndicator.style.display = 'none';
         });

   }

   function loadPromiseSetsData(e) {
      const promise1 = new Promise(function(resolve, reject) {
         setTimeout(() => reject('Promise #1'), 4000);
      });

      const promise2 = new Promise(function(resolve, reject) {
         setTimeout(() => reject('Promise #2'), 1000);
      });

      const promise3 = new Promise(function(resolve, reject) {
         setTimeout(() => reject('Promise #3'), 1500);
      });

      // // Reject if any fail
      // Promise.all([promise1, promise2, promise3])
      //    .then(results => console.log(results))
      //    .catch(reason => console.error(reason));

      // // All of them to be run
      // Promise.allSettled([promise1, promise2, promise3])
      //    .then(results => console.log(results));

      // // First to finish
      // Promise.race([promise1, promise2, promise3])
      //    .then(results => console.log(results))
      //    .catch(reason => console.error(reason));

      // First fulfilled (success) or all errors
      // Promise.any([promise1, promise2, promise3])
      //    .then(results => console.log(results))
      //    .catch(reason => console.error(reason.errors));
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