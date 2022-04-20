

const PlanificationIndex = () =>{

    const [ page, setPage ] = React.useState( 'INIT' )

    const [ selectedPlanification, setSelectedPlanification ] = React.useState( { uuid:"" } )

    const [ planificationList, setPlanificationList ] = React.useState( [] )

    const [ flagChangePlanification, setFlagChangePlanification ] = React.useState( false )

    const backAction = () => {

        switch ( page ) {
            case 'INIT':
                return null
            case "NEW":
                setPage("INIT")
                break
            case "VIEW":
                setPage("INIT")
                break
            default:
                return null
        }

    }

    let pageBlock = <LoadingPage />
    let size = [ '375px', '90vh' ]

    if ( page === 'LOADING' ){
        pageBlock = <LoadingPage />
        size = [ '375px', '90vh' ]
    } else if ( page === 'INIT' ){
        pageBlock = <InitPlanificationPage 
                            setPage={ setPage } 
                            page={ page }
                            planificationList={ planificationList }
                            setPlanificationList={ setPlanificationList }
                            selectedPlanification={ selectedPlanification }
                            setSelectedPlanification={ setSelectedPlanification }
                    />
                            
        size = [ "350px" ,'92vh' ]
    } else if ( page === 'NEW' ){

        pageBlock = <UserProvider>
                        <NewPlanification
                                setPage={ setPage } 
                                planificationList={ planificationList }
                                setPlanificationList={ setPlanificationList }
                                page={ page }
                                selectedPlanification={ selectedPlanification }
                                setSelectedPlanification={ setSelectedPlanification }
                        />
                    </UserProvider>
                            
        size = [ "100%" ,'92vh' ]
    }  else if ( page === 'VIEW' ){

        document.querySelector(".sidenav").style.marginLeft == "-280px" ? "" : document.querySelector(".icono.izquierda").click() 

        pageBlock = <ViewPlanificationAndInitPage
                            setPage={ setPage } 
                            planificationList={ planificationList }
                            setPlanificationList={ setPlanificationList }
                            page={ page }
                            selectedPlanification={ selectedPlanification }
                            setSelectedPlanification={ setSelectedPlanification }
                            flagChangePlanification={ flagChangePlanification }
                            setFlagChangePlanification={ setFlagChangePlanification }
                    />  

        size = [ "100%" ,'92vh' ]
    }

    return <Window 
                    title={ i18n.gettext( 'Planificación' ) } 
                    page={ pageBlock } 
                    pageContainer="v_planificacion" 
                    width={ size[ 0 ] } 
                    height={ size[ 1 ] }
                    backAction={ backAction } />

}

function constructor_planificacion( ){

}

function activateEditionMode(){

    document.querySelector("#window_overlay").style.display = "block"

    document.querySelector("#window_overlay").onclick = () =>{

        const modal_config = {
            "titulo": i18n.gettext("Confirmación"),
            "class": "confirmacion",
            "body": <ConfirmationModal />,
            "close_in_background": true,      //cierra el modal al tocar el fondo
            "boton_positivo": true,
            "boton_negativo": true,
            "boton_positivo_texto": i18n.gettext("Continuar"),
            "boton_negativo_texto": i18n.gettext("Cancelar"),
            "boton_positivo_action": () => {

                cerrar_ventanas()
                modal_destructor()
                deactivateEditionMode()
        
            },
            "boton_negativo_action": () => {
                modal_destructor()
            }
        }
    
        modal_constructor( modal_config, () => {
            $('.modal-body .confirmacion .mensajes > p').hide();
            $('.modal-body .confirmacion .mensajes > p.terminar_operacion').show();
        } );

    }

    

}

function deactivateEditionMode(){

    document.querySelector("#window_overlay").onclick = null

    document.querySelector("#window_overlay").style.display = "none"

}

let flagPlanifiaction = false

function destructor_planificacion(){

    deactivateEditionMode()
    document.querySelector(".sidenav").style.marginLeft == "-280px" ? document.querySelector(".open_caret a").click() : ""
    ReactDOM.render( null, document.getElementById('window_root') );

}

function getExtraCost(){

    let promise = $.ajax({
        type: 'GET',
        url: url_api + '/planification/extra_costs',
        xhrFields: {withCredentials: true}
    }).promise();
  
    return(promise)

}

function postPlanification( data ){

    let promise = $.ajax({
        type: "POST",
        url: url_api + '/planification',
        data: JSON.stringify( data ) ,
        contentType: 'application/json',
        xhrFields: {withCredentials: true}
    }).promise();
  
    return(promise)

}

function putPlanification( data ){

    let promise = $.ajax({
        type: "PUT",
        url: url_api + '/planification/'+data.uuid,
        data: JSON.stringify( data ) ,
        contentType: 'application/json',
        xhrFields: {withCredentials: true}
    }).promise();
  
    return(promise)

}

function deletePlanification( uuid ){

    let promise = $.ajax({
        type: "DELETE",
        url: url_api + '/planification/'+uuid,
        xhrFields: {withCredentials: true}
    }).promise();
  
    return(promise)

}

function getPlanification(){

    let promise = $.ajax({
        type: 'GET',
        url: url_api + '/planification',
        xhrFields: {withCredentials: true}
    }).promise();
  
    return(promise)

}

function getCiclosV2(){

	let promesa = $.ajax({
    	type: 'GET',
    	url: url_api+'/labores/ciclos',
    	
    	xhrFields: {withCredentials: true},
			
	}).promise()

    return promesa
}

function getMoneyUnit(){
      
    let promesa = $.ajax({
        type: 'GET',
        url: url_api+'/utils/currencies',
        xhrFields: {withCredentials: true}
    }).promise()
    
    return promesa
	
}

function postNewCrop( data ){

    let promise = $.ajax({
        type: "POST",
        url: url_api + '/crops',
        data: JSON.stringify( data ) ,
        contentType: 'application/json',
        xhrFields: {withCredentials: true}
    }).promise();
  
    return(promise)

}
function postNewVariety( data, id ){

    let promise = $.ajax({
        type: "POST",
        url: url_api + '/crops/' + id + "/varieties",
        data: JSON.stringify( data ) ,
        contentType: 'application/json',
        xhrFields: {withCredentials: true}
    }).promise();
  
    return(promise)

}

function postAssingLabour( data ){

    let promise = $.ajax({
        type: "POST",
        url: url_api + '/registro_campo/planificacion',
        data: JSON.stringify( data ) ,
        contentType: 'application/json',
        xhrFields: {withCredentials: true}
    }).promise();
  
    return(promise)

}