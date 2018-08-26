$("#btn-login").click(function(){
    $.ajax({
        url:"/login",
        data:"correo="+$("#usuario").val()+"&contrasenia="+$("#contrasenia").val(),
        method:"POST",
        dataType:"json",
        success:function(respuesta){
            if (respuesta.estatus == 0 )
                window.location.href ="homecode.html";
            else
                alert("Credenciales incorrectas");
            console.log(respuesta);
        }
    });
});

$(document).ready(function(){
	//Esta funcion se ejecuta cuando la página esta lista
	$.ajax({
		url:"/planes",
		dataType:"json",
		success:function(respuesta){
			console.log(respuesta);
			for(var i=0; i<respuesta.length; i++){
				
				$("#selectPlanes").append('<option value="'+respuesta[i].CODIGO_PLAN+'">'+respuesta[i].NOMBRE_PLAN+'</option>');
			}
		}
	});

});

$("#btn-insertar").click(function(){
	//alert("Enviar mensaje: " + $("#txta-mensaje").val());
	var parametros = "tipousuario="+$("#selectPlanes").val() +"&" +
					 "nombre="+$("#nombre").val() + "&"+
					 "apellido="+$("#apellido").val() + "&"+
                     "correo="+$("#correo").val() + "&"+
                     "contrasenia="+$("#contrasenia").val()+ "&"+
                     "nombreusuario="+$("#username").val();
	$.ajax({
		url:"/insertar-usuario",
		method:"POST",
		data:parametros,
		dataType:"json",
		success:function(respuesta){
            window.location.href ="login.html";
			console.log(respuesta);
		}
	});
});