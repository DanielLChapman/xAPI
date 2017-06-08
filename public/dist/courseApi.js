function hoverOid(type, oid) {
	var http = new XMLHttpRequest();
	var url = "/api/apiUpdateSession/" + type + "/" + oid;
	http.open("POST", url, true);
	 
	http.setRequestHeader("Content-type", "application/json");
	
	http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
        console.log('updated');
    }
	}
	
	http.send();
}