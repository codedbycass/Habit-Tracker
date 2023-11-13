var done = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");

Array.from(done).forEach(function(element) {
      element.addEventListener('click', function(){
        const habit = this.parentNode.parentNode.childNodes[1].innerText
        const done = parseFloat(this.parentNode.parentNode.childNodes[3].innerText)
        fetch('habit', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'habit': habit,
            'done': done
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function(){
    const habit = this.parentNode.parentNode.childNodes[1].innerText
    fetch('/habit', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'habit': habit
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});
