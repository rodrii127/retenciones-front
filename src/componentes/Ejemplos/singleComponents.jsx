
const PlanificationElement = ({ data, setSelectedPlanification, flag, setPage, flagChangePlanification, setFlagChangePlanification, originalPlanificationList }) =>{

    const [ flagTwo, setFlagTwo ] = React.useState( false )

    const questionBeforeSave = () =>{

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

                const newData = { ...data }

                setSelectedPlanification(  newData   )
                
                setPage( "VIEW" )

                setFlagChangePlanification( false )

                deactivateEditionMode()

                modal_destructor()
        
            },
            "boton_negativo_action": () => {
                modal_destructor()
            }
        }
    
        modal_constructor( modal_config, () => {
            $('.modal-body .confirmacion .mensajes > p').hide();
            $('.modal-body .confirmacion .mensajes > p.planificacion_exit').show();
        } );

    }

    const removePlanification = () =>{

        deletePlanification( data.uuid ).then( res =>{

            toastPlanificacion( "success", 2 )
            setPage( "INIT" )

            Auracom.trackEvent( 'planning_delete', null, AMPLITUDE_EVENTS_OPTIONS )
            
        }).catch( err =>{
            toastPlanificacion( "error", 3 )
        })

    }

    const assingLabourToFarm = () =>{

        if( data.labourList.length == 0 ){
            toastPlanificacion( "info", 3 )
            return
        }

        const modal_config = {
            "titulo": i18n.gettext("Confirmación"),
            "class": "confirmacion",
            "body": <PlanningFieldAssignModal />,
            "close_in_background": true,      //cierra el modal al tocar el fondo
            "boton_positivo": true,
            "boton_negativo": true,
            "boton_positivo_texto": i18n.gettext("Continuar"),
            "boton_negativo_texto": i18n.gettext("Cancelar"),
            "boton_positivo_action": () => {

                let listaLotes = []

                document.querySelectorAll( "#id_asignar_labor_lote .lote .dropdown .box_lote" ).forEach( other => {
                    if( other.getAttribute( "value" ) == "activado" ){
                        
                        listaLotes.push( Number( other.closest( ".elemento_lote" ).getAttribute("lote") ) )

                    }
                })
                let idCampo = Number( document.querySelector( "#id_asignar_labor_lote .campo .form-input" ).getAttribute( "id_campo" ) )
                let flagPermisos = true
                listaLotes.forEach( idLote =>{
                    if ( !validar_permisos( id_fx=fx.ACT_CAM_A , campo=idCampo , lote=idLote ) ){
                        flagPermisos = false
                    }
                })

                if( flagPermisos == false ){
                    toastPlanificacion( "info", 4 )
                    return
                }

                if( listaLotes.length > 0 ){
                    if( data.labourList.length > 0 ){

                        document.querySelector(".modal-footer").style.opacity = "0.6"
                        document.querySelector(".modal-footer").style.pointerEvents = "none"

                        let promiseList = data.labourList.map( labour => {
                            if( labour.labour == "Cosecha" ){
                                let body = {
                                    "tipo": "COSECHA",
                                    "payload": {
                                        "yeargroup": state.campaign,
                                        "fields": listaLotes,
                                        "date": labour.date,
                                        "id_ciclo_cultivo": data.id_ciclo,
                                        "status": 1,
                                        "tipo": "POST",
                                        "labour_cost":{
                                            "value": labour.cost.labourCost ,
                                            "unit": labour.cost.labourUnit
                                        }
                                    }
                                }
                                return body 
                            }
                            if( labour.labour == "Aplicacion" ){
                                let body = {
                                    "tipo": "APLICACION",
                                    "payload": {
                                        "date": labour.date,
                                        "yeargroup": state.campaign,
                                        "id_ciclo_cultivo": data.id_ciclo,
                                        "inputs": labour.cost.inputsCost.map( input => {
                                            return {
                                                "cost":{
                                                    "value": input.cost,
                                                    "unit": labour.cost.labourUnit.split("/")[0] + "/" +  input.unit.name.split("/")[0]
                                                 },
                                                 "dose": input.dose,
                                                 "unit": input.unit.name,
                                                 "uuid": input.uuid
                                            }
                                        }),
                                        "status": 1,
                                        "fields": listaLotes,
                                        "labour_cost":{
                                            "value": labour.cost.labourCost ,
                                            "unit": labour.cost.labourUnit
                                        }
                                    }
                                }
    
                                return body
                            }
                            if( labour.labour == "Siembra" ){
                                let body = {
                                    "tipo": "SIEMBRA",
                                    "payload": {
                                        "fields": listaLotes,
                                        "yeargroup": state.campaign,
                                        "date": labour.date,
                                        "status": 1,
                                        "crop": labour.crop.key,
                                        "id_ciclo_cultivo": data.id_ciclo,
                                        "seed_rate": {
                                            "value": labour.cost.cropCost.density,
                                            "unit": labour.cost.cropCost.unit.name
                                        },
                                        "labour_cost":{
                                            "value": labour.cost.labourCost ,
                                            "unit": labour.cost.labourUnit
                                        },
                                        "seed_cost":{
                                            "value": labour.cost.cropCost.cost,
                                            "unit": labour.cost.labourUnit.split( "/" )[0] + "/" + labour.cost.cropCost.unit.name.split("/")[0]
                                        },
                                        "inputs": labour.cost.inputsCost.map( input => {
                                            return {
                                                "cost":{
                                                    "value": input.cost,
                                                    "unit": labour.cost.labourUnit.split("/")[0] + "/" +  input.unit.name.split("/")[0]
                                                 },
                                                 "dose": input.dose,
                                                 "unit": input.unit.name,
                                                 "uuid": input.uuid
                                            }
                                        }),
                                        "web": true
                                    }
                                }
                                if( labour.variety.key ){
                                    body.payload.variety = labour.variety.key
                                }
                                return body
                            }
                        })

                        let datosLaboresEnviar = {
                            uuid: data.uuid,
                            labores: promiseList
                        }

                        postAssingLabour( datosLaboresEnviar ).then( res => {
                            document.querySelector(".modal-footer").style.opacity = "1"
                            document.querySelector(".modal-footer").style.pointerEvents = "all"
                            let flag = false
                            let mens = ""
                            res.forEach( respuesta => {
                                if( respuesta.resultado == 200 ){

                                }else{
                                    flag = true
                                    if( respuesta.payload.tipo == "SIEMBRA" ){
                                        mens = mens + `<p>  -  ${ i18n.gettext("Siembra") } ${ respuesta.payload.payload.date } </p>`
                                    }
                                    if( respuesta.payload.tipo == "COSECHA" ){
                                        mens = mens + `<p>  -  ${ i18n.gettext("Cosecha") } ${ respuesta.payload.payload.date } </p>`
                                    }
                                    if( respuesta.payload.tipo == "APLICACION" ){
                                        mens = mens + `<p>  -  ${ i18n.gettext("Aplicación") } ${ respuesta.payload.payload.date } </p>`
                                    }
                                }
                            })
                            if( flag ){
                                toastPlanificacion( "error", 9, mens )
                            }else{
                                toastPlanificacion( "success", 3 )
                            }
                            document.querySelector(".modal-footer").style.opacity = "1"
                            document.querySelector(".modal-footer").style.pointerEvents = "all"
                            modal_destructor()

                            Auracom.trackEvent( 'planning_assign', null, AMPLITUDE_EVENTS_OPTIONS )
                            
                        }).catch( err => {
                            toastPlanificacion( "error", 4 )
                            document.querySelector(".modal-footer").style.opacity = "1"
                            document.querySelector(".modal-footer").style.pointerEvents = "all"
                        })

                    }
                }else{
                    toastPlanificacion( "info", 2 )
                }
        
            },
            "boton_negativo_action": () => {
                modal_destructor()
            }
        }

        modal_constructor( modal_config, () => {

            document.querySelector( "#id_asignar_labor_lote" ).innerHTML = ``

            document.querySelector( "#id_asignar_labor_lote" ).innerHTML = `
                <div class="title"> ${ i18n.gettext( "Añadir labores de planificación a:" ) } </div>
                <div class="nuevo_input campana">
                    <div class="form-tag"> ${ i18n.gettext( "CAMPAÑA" ) } </div>
                    <div class="form-input"><input type="text" disabled></div>
                    <div class="dropdown"></div>
                </div>
                <div class="nuevo_input campo">
                    <div class="form-tag">${ i18n.gettext( "CAMPO" ) }</div>
                    <div class="form-input"><input type="text" placeholder=${ i18n.gettext("Seleccione un campo") }></div>
                    <div class="dropdown">
                        ${
                            getAllFarms().map( field => {
                                return `<div campo="${ field.id }" class="elemento_campo" style="display: block">  ${ field.nombre_campo } </div>`
                            }).join("")
                        }
                    </div>
                </div>
                <div class="nuevo_input lote">
                    <div class="form-tag">${ i18n.gettext( "LOTE" ) }</div>
                    <div class="form-input"><input type="text" placeholder=${ i18n.gettext("Seleccione un lote") }></div>
                    <div class="dropdown"></div>
                </div>
            `
    
            document.querySelector( "#id_asignar_labor_lote .campo .form-input" ).onclick = () =>{
                event.stopPropagation()
                document.querySelectorAll( "#id_asignar_labor_lote .dropdown" ).forEach( dropdown => {
                    dropdown.style.display = "none"
                })
                document.querySelector( "#id_asignar_labor_lote .campo .dropdown" ).style.display = "block"
                
            }
    
            document.querySelector( "#id_asignar_labor_lote .lote .form-input" ).onclick = () =>{
                event.stopPropagation()
                document.querySelectorAll( "#id_asignar_labor_lote .dropdown" ).forEach( dropdown => {
                    dropdown.style.display = "none"
                })
                document.querySelector( "#id_asignar_labor_lote .lote .dropdown" ).style.display = "block"
                
            }
    
            document.querySelectorAll( "#id_asignar_labor_lote .campo .dropdown div" ).forEach( element  => {
                element.onclick = () =>{
                    event.stopPropagation()
                    document.querySelector( "#id_asignar_labor_lote .campo .form-input input" ).value = event.target.innerText
                    document.querySelector( "#id_asignar_labor_lote .campo .form-input" ).setAttribute( "id_campo", event.target.getAttribute("campo") )
                    document.querySelector( "#id_asignar_labor_lote .campo .dropdown" ).style.display = "none"
                    document.querySelector( "#id_asignar_labor_lote .lote .dropdown" ).innerHTML = ""
                    document.querySelector( "#id_asignar_labor_lote .lote .dropdown" ).innerHTML = `
                        ${
                            Object.keys( getAllFarms().find( farm => farm.id == event.target.getAttribute( "campo" ) ).lotes ).map( lote => {
                                return `<div lote="${ lote }" class="elemento_lote" >  
                                            <div class="box_lote" value="desactivado"> <span class="glyphicon glyphicon-ok"></span> </div>
                                            <div class="nombre_lote"> ${ getAllFarms().find( farm => farm.id == event.target.getAttribute( "campo" ) ).lotes[ lote ].nombre_lote } </div>
                                        </div>`
                            }).join("")
                        }
                    `
                    document.querySelector( "#id_asignar_labor_lote .lote .form-input input" ).value = `${ i18n.gettext("Sin selección") }`
    
                    document.querySelectorAll( "#id_asignar_labor_lote .lote .dropdown .box_lote" ).forEach( element  => {
                        element.onclick = () =>{
                            event.stopPropagation()
                            let counter = 0
                            if( element.getAttribute( "value" ) == "desactivado" ){
                                element.querySelector("span").style.display = "block"
                                element.setAttribute("value", "activado")
                            }else{
                                element.querySelector("span").style.display = "none"
                                element.setAttribute("value", "desactivado")
                            }
                            
                            document.querySelectorAll( "#id_asignar_labor_lote .lote .dropdown .box_lote" ).forEach( other => {
                                if( other.getAttribute( "value" ) == "activado" ){
                                    counter = parseInt( counter ) + 1
                                }
                            })
                            
                            document.querySelector( "#id_asignar_labor_lote .lote .form-input input" ).value = `${ counter } ${ i18n.gettext("seleccionado") }`
            
                        }
                    })
                }
            })
    
            document.querySelector( ".modal-content.confirmacion" ).onclick = () =>{
    
                if( event.target.closest( ".form-input" ) ){
    
                }else{
                    document.querySelectorAll( "#id_asignar_labor_lote .dropdown" ).forEach( dropdown => {
                        dropdown.style.display = "none"
                    })
                }
               
            }
    
            document.querySelector("#id_asignar_labor_lote .campana .form-input input").value = data.date
    
            document.querySelector( "#id_asignar_labor_lote .campo .form-input input" ).addEventListener("keyup", () =>{
                
                document.querySelectorAll("#id_asignar_labor_lote .nuevo_input.campo .dropdown .elemento_campo").forEach( elementoCampo => {
                    if( elementoCampo.innerText.toLowerCase().indexOf( event.target.value.toLocaleLowerCase() ) > -1 ){
                        elementoCampo.style.display = "block"
                    }else{
                        elementoCampo.style.display = "none"
                    }
                })
                
            })
    
            document.querySelector( "#id_asignar_labor_lote .lote .form-input input" ).addEventListener("keyup", () =>{
                
                document.querySelectorAll("#id_asignar_labor_lote .nuevo_input.lote .dropdown .elemento_lote").forEach( elementoLote => {
                    if( elementoLote.querySelector(".nombre_lote").innerText.toLowerCase().indexOf( event.target.value.toLocaleLowerCase() ) > -1 ){
                        elementoLote.style.display = "flex"
                    }else{
                        elementoLote.style.display = "none"
                    }
                })
                
            })
    
            document.querySelector( "#id_asignar_labor_lote .campo .form-input input" ).addEventListener("blur", () =>{
                
                if( !getAllFarms().find( farm => farm.nombre_campo == event.target.value ) ){
                    document.querySelector( "#id_asignar_labor_lote .campo .form-input " ).setAttribute("id_campo", null)
                    document.querySelector( "#id_asignar_labor_lote .lote .form-input input" ).value = `${ i18n.gettext("Sin selección") }`
                    document.querySelector( "#id_asignar_labor_lote .lote .dropdown" ).innerHTML = ""
                }
                
            })

        } );

        /* document.querySelector( "#id_asignar_labor_lote .campana .form-input input" ).value =  `` */
        /* document.querySelector( "#id_asignar_labor_lote .lote .form-input input" ).value =  `${ i18n.gettext("Sin selección") }`
        document.querySelector( "#id_asignar_labor_lote .campo .form-input input" ).value =  `${ i18n.gettext("Sin selección") }` */


    }   

    const selectElement = () =>{

        if( flagChangePlanification ){
            
            questionBeforeSave()

        }else{

            const newData = { ...data }

            setSelectedPlanification(  newData   )
            
            setPage( "VIEW" )
        }
        
    }

    document.addEventListener( "click", function(){

        if( event.target.closest( ".glyphicon.glyphicon-option-vertical" ) ){

        }else{
            setFlagTwo( false )
        }

    })

    const calculateCostTotal = () =>{

        let total = 0
        data.labourList.map( e =>{
            total = parseFloat( total ) + parseFloat( e.cost.totalCost )
        })
        data.listOfPrices.map( e =>{
            total = parseFloat( total ) + parseFloat( e.value )
        })

        return total.toFixed( 2 )
    }

    const calculateIncome = () =>{

        return ( data.sensibilityValues.performance[2] * data.sensibilityValues.price[2] ).toFixed( 2 )

    }

    const calculateMB = () =>{

        return( calculateIncome() - calculateCostTotal() ).toFixed( 2 )

    }

    const duplicatePlanification = () =>{
        
        let newCopyPlanification = { ...originalPlanificationList.find( planification => planification.uuid == data.uuid ) }
        newCopyPlanification.uuid = generateUUID()
        newCopyPlanification.name = newCopyPlanification.name + "2"
        if( newCopyPlanification.labours.length > 0 ){
            newCopyPlanification.labours.map( labourElement => {
                labourElement.uuid ? delete labourElement.uuid : ""
            })
        }
        postPlanification( newCopyPlanification ).then( res =>{
            
            setPage( "INIT" )

            toastPlanificacion( "success", 4 )

            Auracom.trackEvent( 'planning_duplicated', null, AMPLITUDE_EVENTS_OPTIONS )

        }).catch( err =>{

            toastPlanificacion( "error", 5 )

        })

    }
    
    return(
        <div className="elemento premium-window-body" style={ flag ? { background: "#35354b" } : {} } onClick={ selectElement } >
            <div className="datos">
                <div className="titulo">
                    <div className="nombre" style={ flag ? { color: "#1998da" } : {} } >  { data.name }  </div>
                    {
                        flag ?
                        <span className="glyphicon glyphicon-option-vertical" onClick={ () => setFlagTwo( !flagTwo ) } >  </span>
                        :
                        ""
                    }
                    {
                        flagTwo ?
                        <div className="opciones premium-window-section" onClick={ () => setFlagTwo( !flagTwo ) }> 
                            <div className="item-opciones" onClick={ duplicatePlanification }> { i18n.gettext( "Duplicar" ) } </div>
                            <div className="item-opciones" onClick={ assingLabourToFarm }  > { i18n.gettext( "Asignar a lotes" ) } </div>
                            <div className="item-opciones" onClick={ removePlanification }> { i18n.gettext( "Borrar" ) } </div>
                        </div>
                        :
                        ""
                    }
                </div>
                <div className="tipo"> { data.date }  </div>
                <div className="valores">
                    <div className="valor costo">
                        <div className="nombre"> { i18n.gettext( "Costo" ) }  </div>
                        <div className="valor"> { calculateCostTotal() } { data.preSensibilityValues.priceUnit.name.split("/")[0] + "/ha" } </div>
                    </div>
                    <div className="valor margen premium-window-section">
                        <div className="nombre"> { i18n.gettext( "Margen" ) }  </div>
                        <div className="valor"> { calculateMB() } { data.preSensibilityValues.priceUnit.name.split("/")[0] + "/ha" }  </div>
                    </div>
                </div>
            </div>
            
        </div>
    )

}

const NewPlanification = ({ setPage, planificationList, setPlanificationList, page, setSelectedPlanification }) =>{

    const [ flagLabour, setFlagLabour ] = React.useState( false )

    const [ flagSensibility, setFlagSensibility ] = React.useState( false )

    const [ labourList, setLabourList ] = React.useState( [] )

    const { unitSensibility, unitPrice } = React.useContext( UserContext )

    const [ preSensibilityValues, setPreSensibilityValues ] = React.useState({
        performance: 0, 
        price: 0, 
        performanceUnit: unitSensibility[0],
        priceUnit: unitPrice[0], 
        valueSliderPerformance: 0,
        valueSliderPrice: 0
    })

    const [ flagLabourType, setFlagLabourType ] = React.useState( 0 )
    
    const [ labourSelectedForEdit, setLabourSelectedForEdit ] = React.useState()

    const [ sensibilityValues, setSensibilityValues ] = React.useState({ 
        performance: {
            1: 0,
            2: 0,
            3: 0
        },
        price: {
            1: 0,
            2: 0,
            3: 0
        } 
    })

    React.useEffect(() => {
        
        return () => {
            
        }
    }, [])

    return(
        
            <div className="mirar-editar-planificacion">
                <CreateNewPlanification 
                    labourList={ labourList } 
                    setLabourList={ setLabourList } 
                    flagLabour={ flagLabour } 
                    setFlagLabour={ setFlagLabour } 
                    planificationList={ planificationList } 
                    setPlanificationList={ setPlanificationList } 
                    setPage={ setPage } 
                    page={ page } 
                    setSelectedPlanification={ setSelectedPlanification }
                    setFlagSensibility={ setFlagSensibility }
                    sensibilityValues={ sensibilityValues }
                    preSensibilityValues={ preSensibilityValues }
                    setFlagLabourType={ setFlagLabourType }
                    setLabourSelectedForEdit={ setLabourSelectedForEdit }
                />
                { 
                    flagLabour ? 
                    <PageLobour 
                        labourList={ labourList } 
                        setLabourList={ setLabourList } 
                        setFlagLabour={ setFlagLabour } 
                    /> 
                    : 
                    "" 
                }
                {
                    flagSensibility ?
                    <PageSensibility 
                        setFlagSensibility={ setFlagSensibility } 
                        setSensibilityValues={ setSensibilityValues }
                        preSensibilityValues={ preSensibilityValues }
                        setPreSensibilityValues={ setPreSensibilityValues }
                    />
                    :
                    ""
                }
                {
                    flagLabourType != 0 ?
                    <PageEditLabour 
                        flagLabourType={ flagLabourType } 
                        setFlagLabourType={ setFlagLabourType } 
                        labourSelectedForEdit={ labourSelectedForEdit }
                        labourList={ labourList }
                        setLabourList={ setLabourList } 
                    />
                    :
                    ""
                }
            </div>
       
    )

}

const ViewPlanificationAndInitPage = ({ setPage, planificationList, setPlanificationList, page, selectedPlanification, setSelectedPlanification, flagChangePlanification, setFlagChangePlanification  }) =>{

    const [ loading, setLoading ] = React.useState( true )

    const [ flagLabour, setFlagLabour ] = React.useState( false )

    const [ flagSensibility, setFlagSensibility ] = React.useState( false )

    const [ labourList, setLabourList ] = React.useState( selectedPlanification.labourList )

    const [ preSensibilityValues, setPreSensibilityValues ] = React.useState( selectedPlanification.preSensibilityValues )

    const [ sensibilityValues, setSensibilityValues ] = React.useState( selectedPlanification.sensibilityValues  )

    const [ flagLabourType, setFlagLabourType ] = React.useState( 0 )
    
    const [ labourSelectedForEdit, setLabourSelectedForEdit ] = React.useState()

    const [ totalExtraCostList, setTotalExtraCostList ] = React.useState([])

    const [ totalCicleList, setTotalCicleList ] = React.useState([])

    React.useEffect(() => {
        getExtraCost().then( res =>{

            if( diccionarios.costs_extras ){
                if( Object.entries(diccionarios.costs_extras).length === 0 ){
                    setTotalExtraCostList( JSON.parse( res ).data )
                }else{
                    let newData = JSON.parse( res ).data.map( elemCosto => {
                        if( diccionarios.costs_extras[ elemCosto.name ] ){
                            return {
                                ...elemCosto,
                                name: diccionarios.costs_extras[ elemCosto.name ]
                            }
                        }else{
                            return elemCosto
                        }
                    })
                    setTotalExtraCostList( newData )
                }
            }else{
                setTotalExtraCostList( JSON.parse( res ).data )
            }      

            getCiclosV2().then( data => {
                setTotalCicleList( JSON.parse( data ).data )
                setLoading( false )
            }).catch( err => {

            })
            
        }).catch( err =>{

        })
    }, [])

    React.useEffect(() => {

        setLabourList( selectedPlanification.labourList  )
        setPreSensibilityValues( selectedPlanification.preSensibilityValues )
        setSensibilityValues( selectedPlanification.sensibilityValues )

    }, [ selectedPlanification.labourList, selectedPlanification.sensibilityValues, selectedPlanification.preSensibilityValues ])

    return(
        loading ?
        <LoadingPagePlanification/>
        :
        <UserProvider>
            <div className="mirar-editar-planificacion">
                <InitPlanificationPage 
                    planificationList={ planificationList } 
                    setPlanificationList={ setPlanificationList } 
                    selectedPlanification={ selectedPlanification }
                    setSelectedPlanification={ setSelectedPlanification } 
                    setPage={ setPage }
                    flagChangePlanification={ flagChangePlanification }
                    setFlagChangePlanification={ setFlagChangePlanification } 
                />
                <ViewPlanification 
                    labourList={ labourList } 
                    setLabourList={ setLabourList } 
                    flagLabour={ flagLabour } 
                    setFlagLabour={ setFlagLabour } 
                    planificationList={ planificationList } 
                    setPlanificationList={ setPlanificationList } 
                    setPage={ setPage } 
                    page={ page } 
                    selectedPlanification={ selectedPlanification } 
                    sensibilityValues={ sensibilityValues }
                    setFlagSensibility={ setFlagSensibility }
                    flagChangePlanification={ flagChangePlanification }
                    setFlagChangePlanification={ setFlagChangePlanification }
                    preSensibilityValues={ preSensibilityValues }
                    setFlagLabourType={ setFlagLabourType }
                    setLabourSelectedForEdit={ setLabourSelectedForEdit }
                    totalExtraCostList={ totalExtraCostList }
                    totalCicleList={ totalCicleList }
                />
                { 
                    flagLabour ? 
                    <PageLobour 
                        labourList={ labourList } 
                        setLabourList={ setLabourList } 
                        setFlagLabour={ setFlagLabour } 
                    /> 
                    : 
                    "" 
                }
                {
                    flagSensibility ?
                    <PageSensibility 
                        setFlagSensibility={ setFlagSensibility } 
                        setSensibilityValues={ setSensibilityValues }
                        preSensibilityValues={ preSensibilityValues }
                        setPreSensibilityValues={ setPreSensibilityValues }
                    />
                    :
                    ""
                }
                {
                    flagLabourType != 0 ?
                    <PageEditLabour 
                        flagLabourType={ flagLabourType } 
                        setFlagLabourType={ setFlagLabourType } 
                        selectedPlanification={ selectedPlanification } 
                        labourSelectedForEdit={ labourSelectedForEdit }
                        planificationList={ planificationList } 
                        setPlanificationList={ setPlanificationList } 
                        setSelectedPlanification={ setSelectedPlanification } 
                        labourList={ labourList }
                        setLabourList={ setLabourList } 
                    />
                    :
                    ""
                }
            </div>
        </UserProvider>
        
    )

}

const PageLobour = ({ labourList, setLabourList, setFlagLabour }) =>{


    return(
        <div className="pagina-labor">
            <div className="fondo"></div>
            <FieldRecord setFlagLabour={ setFlagLabour } labourList={ labourList } setLabourList={ setLabourList } />
        </div>
    )

}

const PageEditLabour = ({ labourList, setLabourList, flagLabourType, setFlagLabourType, labourSelectedForEdit }) =>{

    return(
        <div className="pagina-labor ">
            <div className="fondo"></div>
            <div className="registro-campo-v2 premium-window-body">
                {   
                    flagLabourType == 3 ?
                    <EditSowing 
                        setFlagLabourType={ setFlagLabourType } 
                        labourSelectedForEdit={ labourSelectedForEdit } 
                        labourList={ labourList }
                        setLabourList={ setLabourList } 
                    />
                    :
                    flagLabourType == 1 ?
                    <EditHarvest 
                        setFlagLabourType={ setFlagLabourType }  
                        labourSelectedForEdit={ labourSelectedForEdit }  
                        labourList={ labourList }
                        setLabourList={ setLabourList } 
                    />
                    :
                    flagLabourType == 2 ?
                    <EditApplication 
                        setFlagLabourType={ setFlagLabourType } 
                        labourSelectedForEdit={ labourSelectedForEdit } 
                        labourList={ labourList }
                        setLabourList={ setLabourList } 
                    /> 
                    :
                    ""
                }
            </div>
        </div>
    )

}

const PageSensibility = ({ setFlagSensibility, setSensibilityValues, preSensibilityValues, setPreSensibilityValues }) =>{


    return(
        <div className="pagina-labor">
            <div className="fondo"></div>
            <Sensibility 
                setFlagSensibility={ setFlagSensibility }
                setSensibilityValues={ setSensibilityValues }
                preSensibilityValues={ preSensibilityValues }
                setPreSensibilityValues={ setPreSensibilityValues }
            />
        </div>
    )

} 

const PageSaveFirst = ({ setFlagSaveFirst, setSelectedPlanification, data, setPage, setFlagChangePlanification }) =>{

    return(
        <div className="pagina-labor">
            <div className="fondo"></div>
            <CheckSaveFirst
                setFlagSaveFirst={ setFlagSaveFirst }
                setSelectedPlanification={ setSelectedPlanification }
                data={ data }
                setPage={ setPage }
                setFlagChangePlanification={ setFlagChangePlanification }
            />
        </div>
    )

}

const CheckSaveFirst = ({ setFlagSaveFirst, data, setSelectedPlanification, setPage, setFlagChangePlanification }) =>{

    const continued = () =>{

        if( data.info == 1 ){
            setPage( "NEW" )
        }

        if( data.info == 2 ){
            setSelectedPlanification( data.data )
            setPage( "VIEW" )
            setFlagSaveFirst( false )
        }  

        setFlagChangePlanification( false )

        document.querySelector(".ocultar-sidenav").style.display = "none"

    }

    
    return(
        <div className="check-guardar-primero">
            <div className="contenedor-check-guardar">
                <div className="texto-check"  >
                    { i18n.gettext( "Deseas continuar sin guardar los cambios?" ) }
                </div>
                <div className="botones-check-save-first">
                    <div className="cancelar" onClick={ () => setFlagSaveFirst( false ) }>
                    { i18n.gettext( "Cancelar" ) }
                    </div>
                    <div className="continuar" onClick={ continued }>
                    { i18n.gettext( "Continuar..." ) }
                    </div>
                </div>
            </div>   
        </div>
    )
}

const InputElement = ({ data, setClickButtonInput, inputList, setInputList, listInputsCost, setListInputsCost }) =>{

    const addInput = () => {

        if( inputList.find( input => input.uuid == data.uuid ) ){
            toastPlanificacion( "info", 8 )
            return
        }

        let datos = [ ...inputList ]
        datos.push( data )
        setInputList( datos )

        let inputDose = {
            uuid: data.uuid,
            name: data.name,
            unit: { id: 1, name: "lt/ha" },
            dose: 0,
            cost: 0,
            totalCost: 0
        }

        let newArrayCostInputs = [ ...listInputsCost ]

        newArrayCostInputs.push( inputDose )

        setListInputsCost( newArrayCostInputs )

        setClickButtonInput( false )

    }

    return(
        <div className="elemento-insumo" onClick={ addInput }>
            <div className="icono">
                <div className="a-tipo"> { parseTipoInsumoIconoReact( data.type ) } </div>
            </div>
            <div className="datos">
                <div className="titulo-insumo">
                    <div className="nombre-insumo"> { data.name } </div>
                    <img src="/assets/img/iconos/checked_badge.svg"></img>
                </div>
                <div className="descripcion">
                    { data.type }
                </div>
            </div>
        </div>
    )
}

const InputCard = ({ data, inputList, setInputList, listInputsCost, setListInputsCost }) =>{

    const [ selectUnit, setSelectUnit ] = React.useState( listInputsCost.find( e => e.uuid == data.uuid ) ? listInputsCost.find( e => e.uuid == data.uuid ).unit : { id: 1, name: "lt/ha" }  )

    const [ flag, setFlag ] = React.useState( false )

    const deleteInputFromExisting = () =>{
        
        let nuevosInsumos = inputList.filter( e => e.uuid != data.uuid )
        setInputList( nuevosInsumos )

        let newArrayInputs = listInputsCost.filter( e => e.uuid != data.uuid )
        setListInputsCost( newArrayInputs )

    }

    const changeDoseValue = () =>{

        let newArray = listInputsCost.map( e =>{
            if( e.uuid == data.uuid ){
                return{
                    ...e,
                    dose: event.target.value,
                    unit: selectUnit
                }
            }else{
                return e
            }
        } )

        setListInputsCost( newArray )

    }

    const onblurFunction = () =>{

        if( event.target.value == "" ){
            let newArray = listInputsCost.map( e =>{
                if( e.uuid == data.uuid ){
                    return{
                        ...e,
                        dose: 0,
                        unit: selectUnit
                    }
                }else{
                    return e
                }
            } )
    
            setListInputsCost( newArray )
        }

    }

    const changeFlag = ( value ) =>{

        let selected = {}
        if( value == 1 ){
            selected = { id: 1, name: "lt/ha" } 
        }else{
            selected =  { id: 2, name: "kg/ha" } 
        }

        setFlag( !flag )

        let newArray = listInputsCost.map( e =>{
            if( e.uuid == data.uuid ){
                return{
                    ...e,
                    unit: selected
                }
            }else{
                return e
            }
        } )

        setListInputsCost( newArray )
        setSelectUnit( selected )

    }

    return(
        <div className="tarjeta-insumo-v2" value={ data.uuid } >
            <div className="encabezado">
                <div className="principal">
                    <div className="nombre-insumo">
                        { data.name }
                        <div className="icono">
                            <div className="a-tipo-card"> { parseTipoInsumoIconoReact( data.type ) } </div>
                        </div>
                        <img src="/assets/img/iconos/checked_badge.svg"></img>
                    </div>
                    <div className="otros">
                        { ` ${ parseComposicionInsumo( data.components ) } ` }
                    </div>
                </div>
                <div className="borrar-insumo"> <span className="glyphicon glyphicon-trash" onClick={ deleteInputFromExisting }></span> </div>
            </div>
            <div className="datos">
                <div className="fila">
                    <div className="col-dosis empresa"> { i18n.gettext( "Empresa: " ) } { data.company ? capitalize( data.company ) : '-' } </div>
                    <div className="col-dosis uso"> { i18n.gettext( "Uso hasta: " + '-' ) } </div>
                </div>
                <div className="fila">
                    <div className="col-dosis densidad"> { i18n.gettext( "Densidad: " ) } { data.density ? data.density : '-' } </div>
                    <div className="col-dosis presentacion"> { i18n.gettext( "Presentacion: " ) } { data.state ? capitalize( data.state ) : '-' } </div>
                </div>
            </div>
            <div className="dosis">
                <div className="nombre"> { i18n.gettext( "Dosis " ) } </div>
                <div className="valor"> <input type="number" className="premium-form-label" onBlur={ onblurFunction } min="0" placeholder={ i18n.gettext( "ej: 5" ) } value={ listInputsCost.find( e => e.uuid == data.uuid ) ? listInputsCost.find( e => e.uuid == data.uuid ).dose : 0 } onChange={ changeDoseValue } /> </div>
                <div className="selector premium-form-label" onClick={ () => setFlag( !flag ) } >
                    <div className="seleccionado premium-form-label"> { selectUnit.name } </div>
                    <div className="dropdown premium-form-label" style={ flag ? { display: "block" } : { display: "none" } }>
                        <div onClick={ () => changeFlag( 1 ) } > lt/ha </div>
                        <div onClick={ () => changeFlag( 2 ) } > kg/ha </div>
                    </div>
                </div>
            </div>
            
        </div>
    )

}

function parseTipoInsumoIconoReact( type ){

	let letter, background, color
	switch ( type ) {
		case 'fertilizante':
			letter = 'F'
			background = 'red' 
			color = 'white'
			break;
		case 'herbicida':
			letter = 'H'
			background = 'green'
			color = 'white'
			break;
		case 'fungicida':
			letter = 'F'
			background = 'orange'
			color = 'white'
			break;
		case 'pesticida':
			letter = 'P'
			background = 'violet'
			color = 'white'
			break;
		case 'fitoregulador':
			letter = 'F'
			background = 'blue'
			color = 'white'
			break;
		case 'feromona':
			letter = 'F'
			background = 'brown'
			color = 'white'
			break;
		case 'coadyuvante':
			letter = 'C'
			background = 'black'
			color = 'white'
			break;
		default:
			const randomcolor = getRandomColor()
			letter = type ? type[ 0 ] : '?'
			background = 'rgb(156,39,176)'
			color = 'white'
			break;
	}

	return <div className="icon" style={{ "background": background , "color": color }}> { letter.toUpperCase() } </div> 

}

const InputItemCost = ({ data, listInputsCost, setListInputsCost }) =>{

    const { moneyUnit } = React.useContext( UserContext )

    const calculateTotal = () =>{

        let newArray = listInputsCost.map( e =>{
            if( e.uuid == data.uuid ){
                return{
                    ...e,
                    cost: event.target.value,
                    totalCost: event.target.value * data.dose
                }
            }else{
                return e
            }
        })

        setListInputsCost( newArray )         

    }

    const onblurFunction = () =>{

        if( event.target.value == "" ){
            let newArray = listInputsCost.map( e =>{
                if( e.uuid == data.uuid ){
                    return{
                        ...e,
                        cost: 0,
                        totalCost: 0 * data.dose
                    }
                }else{
                    return e
                }
            })
    
            setListInputsCost( newArray ) 
        }        

    }

    return(
        <div className="fila-precio precio-insumo">
            <div className="celda c-1">
                <div className="nombre"> { data.name } </div>
                <div className="entrada"> <input type="number" min="0" onBlur={ onblurFunction } onChange={ calculateTotal } value={ data.cost }/> </div>
                <div className="unidad">  { moneyUnit.name + "/" + ( data.unit.name ? data.unit.name.split( "/" )[0] : data.unit.split("/") ) } </div>
            </div>
            <div className="celda c-2">
                <div className="nombre"> { Number( data.dose ).toFixed(2) } { data.unit.name ? data.unit.name : data.unit } </div>
                <div className="entrada"> { Number( data.cost * data.dose ).toFixed(2) } </div>
                <div className="unidad"> { moneyUnit.name + "/ha" } </div>
            </div>
        </div>
    )
}

const InputItemCrop = ({ cropCost, setCropCost, cultivation, densityValue, selectedDensityUnit, variety }) =>{

    const [ total, setTotal ] = React.useState( cropCost * densityValue )

    const { moneyUnit } = React.useContext( UserContext )

    const calculateTotal = () =>{
        
        
        setCropCost( event.target.value )
        setTotal( event.target.value * densityValue )

    }

    return(
        <div className="fila-precio precio-insumo">
            <div className="celda c-1">
                <div className="nombre"> { cultivation.value } { variety.value != "" ? " - " + variety.value : "" } </div>
                <div className="entrada"> <input type="number" min="0" onBlur={ ( e ) => e.target.value == "" ? setCropCost( 0 ) : ""  } onChange={ calculateTotal } value={ cropCost }/> </div>
                <div className="unidad"> { moneyUnit.name + "/" } { selectedDensityUnit.name.split("/")[0] } </div>
            </div>
            <div className="celda c-2">
                <div className="nombre"> { densityValue } { selectedDensityUnit.name } </div>
                <div className="entrada"> { Number( total ).toFixed(2) } </div>
                <div className="unidad"> { moneyUnit.name + "/ha" } </div>
            </div>
        </div>
    )
}

const LabourItemCost = ({ sowingCost, setSowingCost, name }) =>{

    const { moneyUnit } = React.useContext( UserContext )

    return(
        <div className="fila-precio precio-insumo">
            <div className="celda c-1">
                <div className="nombre"> { i18n.gettext( name ) } </div>
                <div className="entrada"> <input type="number" min="0" onBlur={ (e) => e.target.value == "" ? setSowingCost( 0 ) : ""  } value={ sowingCost } onChange={ ( e ) => setSowingCost( e.target.value ) } /> </div>
                <div className="unidad"> { moneyUnit.name + "/ha" } </div>
            </div>
        </div>
    )
}

const ElementInputDoubleWithDropDown = ({ value, setValue, selectedItem, setSelectedItem, nameInput, placeholder, list }) =>{

    const [ flag, setFlag ] = React.useState( false )

    const clickItem = ( item ) =>{
        setSelectedItem( item )
        setFlag( false )
    }

    return(

        <div className="input-v2 doble">
            <div className="nombre premium-form-label"> { nameInput } </div>
            <div className="texto">
                <input type="number" value={ value } min="0" onBlur={ (e) => e.target.value == "" ? setValue(0) : "" } onChange={ ( e ) => setValue( e.target.value ) } placeholder={ i18n.gettext( placeholder ) } />
            </div>
            <div className="unidad">
                <div className="seleccionado" onClick={ () => setFlag( true ) }> { list.find( e => e.id == selectedItem.id ).name } </div>
                {
                    flag ?
                    <div className="dropdown-unidad">
                    {
                        list.map( ( item,i ) =>{
                            return <div key={ i } className="elemento-unidad" onClick={ () => clickItem( item ) }> { item.name } </div>
                        })
                    }
                    </div>
                    :
                    ""

                }
            </div>
        </div>

    )
}

const ElementInputWithDropDown = ({ flagCultivation, setFlagCultivation, cultivation, setCultivation, name, placeholder }) =>{

    const clickItem = ( item ) =>{

        setCultivation( item )
        setFlagCultivation( false )
    }

    const emptyOnChange = () =>{

    }

    return(
        <div className="input-v2">
            <div className="nombre premium-form-label"> { i18n.gettext( name) } </div>
            <div className="texto">
                <input type="text" placeholder={ i18n.gettext( placeholder ) } value={ cultivation.value } onChange={ emptyOnChange } onClick={ () => setFlagCultivation( true ) } />
                {
                    flagCultivation ?
                    <div className="dropdown">
                        {
                            Object.entries( cultivos ).map(([key, value]) => {
                                return{key, value} 
                            }).map( ( e,i ) =>{
                                return <div key={ i } className="item-dropdown" onClick={ () => clickItem( e ) } > { e.value } </div>
                            })
                        }
                    </div>
                    :
                    ""
                }
            </div>
        </div>
    )
}

const InputCrop = ({ cultivation, setCultivation, name, placeholder, setVarietyList }) =>{

    const [ valueName, setValueName ] = React.useState( cultivation.value ? cultivation.value : "" )
    const [ list, setList ] = React.useState( [] )
    const [ filterList, setFilterList ] = React.useState( [] )
    const [ flag, setFlag ] = React.useState( false )

    React.useEffect(() => {
        
        setList(
            Object.entries( cultivos ).map(([key, value]) => {
                return{key, value} 
            })
        )
        setFilterList(
            Object.entries( cultivos ).map(([key, value]) => {
                return{key, value} 
            })
        )

        const outClickFunction = () =>{
            if( !event.target.closest( ".input-v2.cultivos" ) ){
                setFlag( false )
            }
        }

        document.addEventListener( "click", outClickFunction )

        return () =>{
            document.removeEventListener( "click", outClickFunction )
        }
 
    }, [])

    React.useEffect(() => {
        
        setValueName( cultivation.value ? cultivation.value : "" )
 
    }, [ cultivation.value ])

    const clickItem = ( item ) =>{

        setCultivation( item )
        setFlag( false )
        setValueName( item.value )
        setVarietyList( variedadesCultivos[ item.key ] ? variedadesCultivos[ item.key ] : {} )            
        
    }

    const emptyOnChange = () =>{

        setValueName( event.target.value )
        setFilterList( list.filter( s => s.value.toLowerCase().indexOf( event.target.value.toLocaleLowerCase() ) > -1 ) ) 

    }

    const newCrop = () =>{

        const modal = {
            "titulo": i18n.gettext("Nuevo cultivo"),
            "class": "form",
            "body": <NewCropFormModal />,
            "close_in_background": true,      //cierra el modal al tocar el fondo
            "boton_positivo": true,
            "boton_negativo": true,
            "boton_positivo_texto": i18n.gettext("Guardar"),
            "boton_negativo_texto": i18n.gettext("Cancelar"),
            "boton_positivo_action": function(){

                document.querySelector(".modal-footer").style.opacity = "0.7"
                document.querySelector(".modal-footer").style.pointerEvents = "none"

                postNewCrop( { nombre: document.querySelector("#form_nuevo_cultivo input").value } ).then( res =>{
                    
                    cultivos[ JSON.parse( res ).data.id ] = document.querySelector("#form_nuevo_cultivo input").value
                    toastPlanificacion( "success", 5 )
                    document.querySelector(".modal-footer").style.opacity = "1"
                    document.querySelector(".modal-footer").style.pointerEvents = "all"
                    setList(
                        Object.entries( cultivos ).map(([key, value]) => {
                            return{key, value} 
                        })
                    )
                    setFilterList(
                        Object.entries( cultivos ).map(([key, value]) => {
                            return{key, value} 
                        })
                    )
                    clickItem( { key: JSON.parse( res ).data.id, value: document.querySelector("#form_nuevo_cultivo input").value } ) 
                    modal_destructor()

                }).catch( err =>{
                    toastPlanificacion( "error", 6 )
                    document.querySelector(".modal-footer").style.opacity = "1"
                    document.querySelector(".modal-footer").style.pointerEvents = "all"
                })

            },
            "boton_negativo_action": modal_destructor
          }
          
          modal_constructor( modal, () => {
            document.querySelector("#form_nuevo_cultivo input").value = valueName
          } )

    }

    return(
        <div className="input-v2 cultivos">
            <div className="nombre premium-form-label"> { name } </div>
            <div className="texto">
                <input type="text" placeholder={ placeholder } value={ valueName } onChange={ emptyOnChange } onClick={ () => setFlag( true ) } />
                {
                    flag ?
                    <div className="dropdown">
                        {
                            valueName != "" ?
                            <div className="item-mas" onClick={ newCrop } > { "+" } { i18n.gettext( "Crear cultivo " ) } { valueName } </div>
                            :
                            ""
                        } 
                        {
                            filterList.map( ( e,i ) =>{
                                return <div key={ i } className="item-dropdown" onClick={ () => clickItem( e ) } > { e.value } </div>
                            })
                        }
                    </div>
                    :
                    ""
                }
            </div>
        </div>
    )
}

const InputVariety = ({ variety, setVariety, name, placeholder, varietyList, setVarietyList, cultivation }) =>{

    const [ valueName, setValueName ] = React.useState( variety.value ? variety.value : "" )
    const [ list, setList ] = React.useState( [] )
    const [ filterList, setFilterList ] = React.useState( [] )
    const [ flag, setFlag ] = React.useState( false )

    React.useEffect(() => {
        const outClickFunction = () =>{
            if( !event.target.closest( ".input-v2.variedad" ) ){
                setFlag( false )
            }
        }

        document.addEventListener( "click", outClickFunction )

        return () =>{
            document.removeEventListener( "click", outClickFunction )
        }
    }, [])

    React.useEffect(() => {
        
        setList(
            Object.entries( varietyList ).map(([key, value]) => {
                return{ key, value: value.nombre } 
            })
        )
        setFilterList(
            Object.entries( varietyList ).map(([key, value]) => {
                return{ key, value: value.nombre } 
            })
        )
 
    }, [varietyList])

    React.useEffect(() => {
        
        setValueName( variety.value ? variety.value : "" )
 
    }, [ variety.value ])

    const clickItem = ( item ) =>{

        setVariety( item )
        setFlag( false )
        setValueName( item.value )
        
    }

    const emptyOnChange = () =>{

        setValueName( event.target.value )
        setFilterList( list.filter( s => s.value.toLowerCase().indexOf( event.target.value.toLocaleLowerCase() ) > -1 ) ) 

    }

    const newVariety = () =>{

        if( cultivation.key == "" ){
            toastPlanificacion( "info", 6 )
            return
        }

        const modal = {
            "titulo": i18n.gettext("Nueva variedad"),
            "class": "form",
            "body": <NewCropFormModal />,
            "close_in_background": true,      //cierra el modal al tocar el fondo
            "boton_positivo": true,
            "boton_negativo": true,
            "boton_positivo_texto": i18n.gettext("Guardar"),
            "boton_negativo_texto": i18n.gettext("Cancelar"),
            "boton_positivo_action": function(){

                document.querySelector(".modal-footer").style.opacity = "0.7"
                document.querySelector(".modal-footer").style.pointerEvents = "none"

                postNewVariety( { nombre: document.querySelector("#form_nuevo_cultivo input").value }, cultivation.key ).then( res =>{
                    
                    clickItem( { key: JSON.parse( res ).data.id, value: document.querySelector("#form_nuevo_cultivo input").value } )
                    if( variedadesCultivos[ cultivation.key ] ){
                        variedadesCultivos[ cultivation.key ][ JSON.parse( res ).data.id ] = { nombre: document.querySelector("#form_nuevo_cultivo input").value, peso_mil: 0 }
                    }else{
                        variedadesCultivos[ cultivation.key ] = {
                            [ JSON.parse( res ).data.id ] : { nombre: document.querySelector("#form_nuevo_cultivo input").value, peso_mil: 0 }
                        }
                    }
                    variedadesCultivos[ cultivation.key ][ JSON.parse( res ).data.id ] = { nombre: document.querySelector("#form_nuevo_cultivo input").value, peso_mil: 0 }
                    toastPlanificacion( "success", 6 )
                    document.querySelector(".modal-footer").style.opacity = "1"
                    document.querySelector(".modal-footer").style.pointerEvents = "all"
                    modal_destructor()
                    setList(
                        Object.entries( variedadesCultivos[ cultivation.key ] ).map(([key, value]) => {
                            return{ key, value: value.nombre } 
                        })
                    )
                    setFilterList(
                        Object.entries( variedadesCultivos[ cultivation.key ] ).map(([key, value]) => {
                            return{ key, value: value.nombre } 
                        })
                    )
                }).catch( err =>{
                    toastPlanificacion( "error", 7 )
                    document.querySelector(".modal-footer").style.opacity = "1"
                    document.querySelector(".modal-footer").style.pointerEvents = "all"
                })

            },
            "boton_negativo_action": modal_destructor
          }
          
          modal_constructor( modal, () => {
            document.querySelector("#form_nuevo_cultivo input").value = valueName
          } )

    }

    const onBlurFunction = () =>{

        if( !list.find( elementVariety => elementVariety.value == event.target.value ) ){
            setVariety({ key: "", value: "" })
        }

    }

    return(
        <div className="input-v2 variedad">
            <div className="nombre premium-form-label"> { name } </div>
            <div className="texto">
                <input type="text" placeholder={ placeholder } value={ valueName } onChange={ emptyOnChange } onBlur={ onBlurFunction } onClick={ () => setFlag( true ) } />
                {
                    flag ?
                    <div className="dropdown">
                        {
                            valueName != "" ?
                            <div className="item-mas" onClick={ newVariety } > { "+" } { i18n.gettext( "Crear variedad " ) } { valueName } </div>
                            :
                            ""
                        } 
                        {   
                            
                            filterList.map( ( e,i ) =>{
                                return <div key={ i } className="item-dropdown" onClick={ () => clickItem( e ) } > { e.value } </div>
                            })
                        }
                    </div>
                    :
                    ""
                }
            </div>
        </div>
    )
}

const SimpleElementInputWithDropDown = ({ value, setValue, name, placeholder, list, size, setFlagChangePlanification }) =>{

    const [ flagCultivation, setFlagCultivation ] = React.useState( false )

    const clickItem = ( item ) =>{

        setValue( item )
        setFlagCultivation( false )
        if( setFlagChangePlanification ){
            setFlagChangePlanification( true )
        }

    }

    React.useEffect(() => {
        
        const clickFuntionInput = () =>{
            !event.target.closest(".input-v2") ? setFlagCultivation( false ) : ""
        }

        document.addEventListener("click", clickFuntionInput )

        return () => {
            removeEventListener( "click", clickFuntionInput )
        }
    }, [])

    return(
        <div className="input-v2 " >
            <div className="nombre premium-form-label"> { i18n.gettext( name) } </div>
            <div className="texto" style={ size == "small" ? { width: "35%" } : {} }>
                <input type="text" placeholder={ i18n.gettext( placeholder ) } value={ value ? value.name : "" } readOnly onClick={ () => setFlagCultivation( true ) } />
                {
                    flagCultivation ?
                    <div className="dropdown">
                        {
                            list.map( ( e,i ) =>{
                                return <div key={ i } className="item-dropdown" onClick={ () => clickItem( e ) } > { e.name } </div>
                            })
                        }
                    </div>
                    :
                    ""
                }
            </div>
        </div>
    )
}

const SimpleElementInputWithDropDownAndFilter = ({ value, setValue, name, placeholder, list, size, setFlagChangePlanification }) =>{

    const [ flagCultivation, setFlagCultivation ] = React.useState( false )

    const [ searchList, setSearchList ] = React.useState( list )

    const [ inputValue, setInputValue ] = React.useState( value ? value.name : "" )

    React.useEffect(() => {
        
        const clickFuntionInput = () =>{
            !event.target.closest(".input-v2") ? setFlagCultivation( false ) : ""
        }

        document.addEventListener("click", clickFuntionInput )

        return () => {
            removeEventListener( "click", clickFuntionInput )
        }

    }, [])

    React.useEffect(() => {
        
        setInputValue( value.name )

    }, [ value.name ])

    const clickItem = ( item ) =>{

        setValue( item )
        setFlagCultivation( false )
        setInputValue( item.name )
        if( setFlagChangePlanification ){
            setFlagChangePlanification( true )
        }

    }

    const filterList = () =>{

        setSearchList( list.filter( s => s.name.toLowerCase().indexOf( event.target.value.toLocaleLowerCase() ) > -1 ) )
        setInputValue( event.target.value )

    }
    
    const onBlurFunction = () =>{

        if( !list.find( s => s.name == event.target.value) ){
            setValue( { id: 0, name: "" } )
        }

    } 

    return(
        <div className="input-v2 " >
            <div className="nombre premium-form-label"> { i18n.gettext( name) } </div>
            <div className="texto" style={ size == "small" ? { width: "35%" } : {} }>
                <input type="text" placeholder={ i18n.gettext( placeholder ) } value={ inputValue } onChange={ filterList } onBlur={ onBlurFunction } onClick={ () => setFlagCultivation( true ) } />
                {
                    flagCultivation ?
                    <div className="dropdown">
                        {
                            searchList.map( ( e,i ) =>{
                                return <div key={ i } className="item-dropdown" onClick={ () => clickItem( e ) } > { e.name } </div>
                            })
                        }
                    </div>
                    :
                    ""
                }
            </div>
        </div>
    )
}

const LoadingPagePlanification = props => {

    return (
        <div className="loading-planificacion premium-window-body">
              <div className="loadingContainer">
                    {/* <img src="assets/img/iconos/loading.svg" alt="" /> */}

                    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
				        <circle cx="50" cy="50" fill="none" ng-attr-stroke="{{config.color}}" ng-attr-stroke-width="{{config.width}}" ng-attr-r="{{config.radius}}" ng-attr-stroke-dasharray="{{config.dasharray}}" stroke="#29abe2" strokeWidth="10" r="35" strokeDasharray="164.93361431346415 56.97787143782138" transform="rotate(42 50 50)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animateTransform></circle>
			        </svg>
              </div>
        </div>
    )
}

const PlanificationEmpty = () => {

    return (
        <div className="no-actividades">
            <div className="caja-vacia">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M82,21.28a.92.92,0,0,0-.9-.36l-.27,0-.25-.07-34-5a1,1,0,0,0-.45,0l-27,9.89L19,26h-.27l-.09.07-.14.14-.08.1L6.92,42a.93.93,0,0,0,.52,1.44l11,2.83V72a.92.92,0,0,0,.65.88L55.49,84h0l.19,0a.59.59,0,0,0,.23,0H56l.15,0,.24-.09L82.62,69.44a.92.92,0,0,0,.47-.81V43.1l9.64-4.63a.93.93,0,0,0,.5-.6,1,1,0,0,0-.14-.75ZM9.21,42,19.58,27.81l34.81,6.42L43.33,50.81ZM55,82,20.26,71.33V46.76l23.24,6a.88.88,0,0,0,1-.37L55,36.62Zm.79-49.33L22.65,26.51l23.89-8.75,31.34,4.6ZM81.25,68.09,56.84,81.63V37.69l6.52,13.85A.92.92,0,0,0,64.6,52l16.65-8ZM64.63,49.92,57.15,34,80.92,23,91,37.28Z"/></svg>
            </div>
            <div className="texto-caja">
                {   
                    i18n.gettext( `No tenés planifaciones creadas. Para crear una toca el boton "CREAR NUEVA"`) 
                }
            </div>
        </div>
    )
}