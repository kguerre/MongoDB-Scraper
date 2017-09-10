$(document).ready(function() {
  $("#addComment").click(function() {
    $("#comment").modal("show");
  });
});

$(document).ready(function() {
  $("#viewComments").click(function() {
    $("#view").modal("show");
  });
});

function hideModal() {
  $(".ui.modal").modal("hide");
}

$(document).on("click", "#save", hideModal);


