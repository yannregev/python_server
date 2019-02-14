//Function that is called when the page is loaded
$(document).ready(function() {
	
	//These functions are a part of the tablesorter plug in
	//they make the tables sortable by clicking on the theads
	$("#phone_table").tablesorter();	
	$("#performance_table").tablesorter();	
	loadTable();
	


	//The function for the submit button
	$("#phoneForm").on("submit", function (e) {
		
		e.preventDefault(); 
		
		// when the submit button is clicked
		if ($(document.activeElement).val() == "Submit" ) {
			
			var data = ConvertFormToJSON($("#phoneForm"));
			var url = "http://localhost:8080/phones";
			
			//Sends a post request to the server (add new phone)
			$.ajax({
				type: "POST",
				url: url,
				contentType: "application/json",
				data: data,
				success: function(data,status) {
					add_phone($("#phoneForm").serializeArray()); //Puts the data in an array
				}
			
			});
		}
		
		// when the delete button is clicked
		if ($(document.activeElement).val() == "Delete" ) {
			var url = "http://localhost:8080/phones/"+$("#phoneForm").find('input[name=id]').val();
			//Sends a delete request to the server (delete phone by id)
			$.ajax({
				type: "DELETE",
				url: url,
				success: function(data,status) {
					if (status == "success") {
						   loadTable();
					}
				}
			
			});
		}
		
		// when the update button is clicked
		if ($(document.activeElement).val() == "Update" ) {
			var data = ConvertFormToJSON($("#phoneForm"));
			var url = "http://localhost:8080/phones/"+$("#phoneForm").find('input[name=id]').val();
//			//Sends a put request to the server (update an existing phone)
			$.ajax({
				type: 'PUT',
				url: url,
				contentType: "application/json",
				data: data,
				success: function(data,status) {
					loadTable();
				}
				   
			
			});
		}
			//When the reset button is clicked
			if ($(document.activeElement).val() == "Reset" ) {
			var url = "http://localhost:8080/phones/reset";
//			//Sends a get request to the server (reset the table)
			$.ajax({
				type: 'GET',
				url: url,
				success: function(data,status) {
					loadTable();
				}
				   
			
			});
		}
});




});

//this converts a form to a JSON object (without it the conversion is to a JSON list)
function ConvertFormToJSON(form){
    var array = jQuery(form).serializeArray();
    var json = {};
    
    jQuery.each(array, function() {
        json[this.name] = this.value || '';
    });
    json = JSON.stringify(json);
    return json;
}

//Function that creates the table
function loadTable() {
	$.get("http://localhost:8080/phones", function(data, status) {
		if (status == "success") {
			//Initializing the table
			var table = document.getElementById("phonesInStock");
			table.innerHTML = ""; //The table is emptied at the start
			
			//Create the head of the table containing the headers
			var head = document.createElement("thead");
			
			head.innerHTML = 	"<tr>"+
								"<th>Picture of product</th>"+
								"<th>Model name</th>"+
								"<th>Brand name</th>"+
								"<th>Operating system</th>"+
								"<th>Screen size</th>"+
								"</tr>";
			
			//Create the body of the table containing all the data from the server
			var body = document.createElement("tbody");
			body.id = "phone_table";
			var tr = [];
			for ( var i = 0; i < data.length; i++) {	
			tr[i] = body.insertRow(i);
			tr[i].innerHTML = 	"<td><img src="+data[i].image+" class ='phone' alt='Picture of "+data[i].model+"'></td>"+
								"<td>"+data[i].model+"</td>"+
								"<td>"+data[i].brand+"</td>"+
								"<td>"+data[i].os+"</td>"+
								"<td>"+data[i].screensize+"</td>";
			}
			
			//Create the foot of the table that holds the form
			var foot = document.createElement("tfoot");
			
			foot.innerHTML =	"<tr>"+
								"<td>Link to image: <input type='url' name='image'></td>"+
								"<td>Model name: <input type='text' name='model'></td>"+
								"<td>Brand name: <input type='text' name='brand'></td>"+
								"<td>Operating system: <input type='text' name='os'></td>"+
								"<td>Screen size: <input type='number' name='screensize'></td>"+
								"<td>id: <input type='number' name='id'></td>"+
								"</tr>";
			
			//Put the final table together
			table.appendChild(head);
			table.appendChild(body);
			table.appendChild(foot);
			$("#phonesInStock").tablesorter();	//Calls the tablesorter function after the table is filled in
		}
	});

}

//Function that is called when the submit button is pressed to add a new phone
function add_phone(new_phone){
	
	var body = document.getElementById("phone_table");
	
	//Creating a new row with the information from the form
	//The information from the form is taken directly and put into this row
	var tr = document.createElement("tr");
	//Takes the data from the array that is created by the pressing of the submit button
	tr.innerHTML = 	"<td><img src="+new_phone[0].value+" class ='phone' alt='Picture of "+new_phone[1].value+"'></td>"+
						"<td>"+new_phone[1].value+"</td>"+
						"<td>"+new_phone[2].value+"</td>"+
						"<td>"+new_phone[3].value+"</td>"+
						"<td>"+new_phone[4].value+"</td>";
	body.appendChild(tr); //The row is put inside the body of the table
	$("table").trigger('update'); //Updates the tablesorter with the new table
}

