<%@ Register src="~/CMSWebParts/DataSources/QueryDataSource.ascx" tagname="QueryDataSource" tagprefix="uc1" %>
<%@ Register Src="~/CMSWebParts/Viewers/Basic/BasicRepeater.ascx" TagPrefix="uc1" TagName="BasicRepeater" %>

<script runat="server">
protected override void OnLoad(EventArgs e)
{ 
    base.OnLoad(e);
    Response.Clear();
    Response.ContentType = "application/json; charset=utf-8";
    Response.AddHeader("Access-Control-Allow-Origin", "http://172.22.2.135");
    //Response.AddHeader("Access-Control-Allow-Origin", "https://s3-us-west-2.amazonaws.com");
    //Response.AddHeader("Access-Control-Allow-Origin", "http://192.168.1.159");

    try
    {
        string pFiltro = Request.QueryString["filtro"];
        string pFecha = Request.QueryString["fecha"];
        string pTexto = Request.QueryString["texto"];
        string pPagina = Request.QueryString["pagina"];
        string pEventosPorPagina = Request.QueryString["eventosPorPagina"];
        string pUrlEvento = Request.QueryString["urlEvento"];
        string pCategoria = Request.QueryString["categoria"];
      
        var listaEventos = new System.Collections.Generic.List<object>();    
        
        var zona = this.FindZone("zoneData");
        if (zona != null)
        {
          this.ProcesarFechasNormales(listaEventos);
          this.ProcesaFechasRecurrentes(listaEventos);
        }
      
        if (!string.IsNullOrEmpty(pFiltro))
        {
            DateTime ahorita = System.DateTime.Now;
            DateTime inicio = new DateTime(ahorita.Year, ahorita.Month, ahorita.Day, 0, 0, 0);
          
            //Filtro por categorias
            if (pFiltro == "todos" || pFiltro == "hoy" || pFiltro == "semana" || pFiltro == "mes")
            {
                if (!string.IsNullOrEmpty(pCategoria))
                  listaEventos = listaEventos.Where((dynamic x) => { return x.codigosCategorias.ToString().Contains(pCategoria); }).ToList();
            }
          
            if (pFiltro == "hoy")
            {
                DateTime fin = new DateTime(ahorita.Year, ahorita.Month, ahorita.Day, 23, 59, 59);
                listaEventos = listaEventos.Where((dynamic x) => { return (DateTime)x.fechaInicio.valor >= inicio && (DateTime)x.fechaFinal.valor <= fin; }).ToList();
            }
            else if (pFiltro == "semana")
            {
                DateTime fin = inicio.AddDays(7);
                fin = new DateTime(fin.Year, fin.Month, fin.Day, 23, 59, 59);
                listaEventos = listaEventos.Where((dynamic x) => { return (DateTime)x.fechaInicio.valor >= inicio && (DateTime)x.fechaFinal.valor <= fin; }).ToList();
            }
            else if (pFiltro == "mes")
            {
                DateTime fin = inicio.AddDays(30);
                fin = new DateTime(fin.Year, fin.Month, fin.Day, 23, 59, 59);
                listaEventos = listaEventos.Where((dynamic x) => { return (DateTime)x.fechaInicio.valor >= inicio && (DateTime)x.fechaFinal.valor <= fin; }).ToList();
            }
            else if (pFiltro == "fecha")
            {
                DateTime fecha;
                if (!string.IsNullOrEmpty(pFecha) && DateTime.TryParse(pFecha, out fecha))
                {
                    if (fecha >= new DateTime(ahorita.Year, ahorita.Month, ahorita.Day, 0, 0, 0))
                    {
                        DateTime fin = new DateTime(fecha.Year, fecha.Month, fecha.Day, 23, 59, 59);
                        listaEventos = listaEventos.Where((dynamic x) => { return (DateTime)x.fechaInicio.valor >= fecha && (DateTime)x.fechaFinal.valor <= fin; }).ToList();
                    }
                }
            }
            else if (pFiltro == "busqueda")
            {
                if (!string.IsNullOrEmpty(pTexto))
                    listaEventos = listaEventos.Where((dynamic x) => { return x.titulo.ToString().ToLower().Contains(pTexto.ToLower()) | x.resumen.ToString().ToLower().Contains(pTexto.ToLower()); }).ToList();
            }
            else if (pFiltro == "evento")
            {
                if (!string.IsNullOrEmpty(pUrlEvento))
                    listaEventos = listaEventos.Where((dynamic x) => { return x.urlEvento.ToString().ToLower() == pUrlEvento.ToLower(); }).ToList();
            }
        }
    
        int totalEventos = listaEventos.Count();
        
        int pagina;
        if (!int.TryParse(pPagina, out pagina))
            pagina = 1;
    
        int eventosPorPagina;
        if (!int.TryParse(pEventosPorPagina, out eventosPorPagina))
            eventosPorPagina = totalEventos;
      
        var cadenaJson = Newtonsoft.Json.JsonConvert.SerializeObject(new 
        {
            filtro = pFiltro,
            fecha = pFecha,
            texto = pTexto,
            total = totalEventos,
            pagina = pPagina,
            eventosPorPagina = pEventosPorPagina,
            categoria = pCategoria,
            eventos = this.paginarResultado(listaEventos.OrderBy((dynamic x) => { return x.fechaInicio.valor; }).ToList(), pagina, eventosPorPagina),
            ServerDateTime = System.DateTime.Now.ToString()
        });
        Response.Write(cadenaJson);
    }
    catch (Exception error)
    {
        Response.Write("{ \"mensajeError\": \"" + error.Message + "\" }");
    }
    Response.End();
}
  
private void ProcesarFechasNormales(System.Collections.Generic.List<object> resultado)
{
    var zona = this.FindZone("zoneData");
    CMSWebParts_DataSources_QueryDataSource qdsFechas = (CMSWebParts_DataSources_QueryDataSource)zona.FindControl("QDS_Fecha");
    if (qdsFechas != null)
    {
        qdsFechas.QueryName = "CMS.FechaAgenda.select_fecha_con_evento_rownumber_service";
        qdsFechas.OrderBy = "F.FechaInicio ASC, F.FechaFinal ASC";
        qdsFechas.Columns = "F.*, E.*, TE.DocumentUrlPath";
        qdsFechas.WhereCondition = "1=1";
        qdsFechas.SelectTopN = 500;
    }

    CMSWebParts_Viewers_Basic_BasicRepeater repetidorFechas = (CMSWebParts_Viewers_Basic_BasicRepeater)zona.FindControl("BR_Fechas");
    if (repetidorFechas != null)
    {
        if (repetidorFechas.DataSourceControl != null)
        {
            if (repetidorFechas.DataSourceControl.DataSource != null)
            {
                System.Data.DataSet datos = (System.Data.DataSet)repetidorFechas.DataSourceControl.DataSource;
                if (datos.Tables.Count > 0)
                {
                    System.Data.DataTable tablaDatos = datos.Tables[0];
                    if (tablaDatos.Rows.Count > 0)
                    {
                        //Por cada CMS.FechaAgenda con el Evento obtenido desde la DB
                        foreach (System.Data.DataRow fila in tablaDatos.Rows)
                        {
                            var dataRowView = tablaDatos.DefaultView.Cast<System.Data.DataRowView>().FirstOrDefault(a => a.Row == fila);
                            
                            DateTime FechaInicio, FechaFinal;
                            if (DateTime.TryParse(fila["FechaInicio"].ToString(), out FechaInicio) && DateTime.TryParse(fila["FechaFinal"].ToString(), out FechaFinal))
                            {
                                var fechaAgenda = new FechaAgenda(FechaInicio, FechaFinal);
                                var subFechas = fechaAgenda.DerivarFechas();

                                //Por cada fecha derivada
                                foreach (var fechaDerivada in subFechas)
                                {
                                    var evento = this.ObtenerObjetoEvento(fila, dataRowView, fechaDerivada.FechaInicio, fechaDerivada.FechaFinal);
                                    resultado.Add(evento);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
                                               
private void ProcesaFechasRecurrentes(System.Collections.Generic.List<object> resultado)
{
    var zona = this.FindZone("zoneData");
    CMSWebParts_DataSources_QueryDataSource qdsFechasRecurrentes = (CMSWebParts_DataSources_QueryDataSource)zona.FindControl("QDS_FechaRecurrente");
    if (qdsFechasRecurrentes != null)
    {
        qdsFechasRecurrentes.QueryName = "CMS.FechaAgendaRecurrente.select_fecha_recurrent_con_evento_rowservice_service";
        qdsFechasRecurrentes.OrderBy = "FR.FechaInicio ASC, FR.FechaFinal ASC";
        qdsFechasRecurrentes.Columns = "FR.*, E.*, TE.DocumentUrlPath";
        qdsFechasRecurrentes.WhereCondition = "1=1";
        qdsFechasRecurrentes.SelectTopN = 500;
    }
    CMSWebParts_Viewers_Basic_BasicRepeater repetidorFechasRecurrentes = (CMSWebParts_Viewers_Basic_BasicRepeater)zona.FindControl("BR_FechasRecurrentes");
    if (repetidorFechasRecurrentes != null)
    {
        if (repetidorFechasRecurrentes.DataSourceControl != null)
        {
            if (repetidorFechasRecurrentes.DataSourceControl.DataSource != null)
            {
                System.Data.DataSet datos = (System.Data.DataSet)repetidorFechasRecurrentes.DataSourceControl.DataSource;
                if (datos.Tables.Count > 0)
                {
                    System.Data.DataTable tablaDatos = datos.Tables[0];
                    if (tablaDatos.Rows.Count > 0)
                    {
                        //Por cada CMS.FechaAgendaRecurrente con el Evento obtenido desde la DB
                        foreach (System.Data.DataRow fila in tablaDatos.Rows)
                        {
                            var dataRowView = tablaDatos.DefaultView.Cast<System.Data.DataRowView>().FirstOrDefault(a => a.Row == fila);
                            DateTime FechaInicio, FechaFinal;
                            if (DateTime.TryParse(fila["FechaInicio"].ToString(), out FechaInicio) && DateTime.TryParse(fila["FechaFinal"].ToString(), out FechaFinal))
                            {
                                var fechaAgendaRecurrente = new FechaAgendaRecurrente(FechaInicio, FechaFinal)
                                {
                                    Lunes = bool.Parse(fila["Lunes"].ToString()),
                                    Martes = bool.Parse(fila["Martes"].ToString()),
                                    Miercoles = bool.Parse(fila["Miercoles"].ToString()),
                                    Jueves = bool.Parse(fila["Jueves"].ToString()),
                                    Viernes = bool.Parse(fila["Viernes"].ToString()),
                                    Sabado = bool.Parse(fila["Sabado"].ToString()),
                                    Domingo = bool.Parse(fila["Domingo"].ToString()),
                                };
                                var subFechas = fechaAgendaRecurrente.DerivarFechas();

                                //Por cada fecha derivada
                                foreach(var fechaDerivada in subFechas)
                                {
                                    var evento = this.ObtenerObjetoEvento(fila, dataRowView, fechaDerivada.FechaInicio, fechaDerivada.FechaFinal);
                                    resultado.Add(evento);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
                                               
public object ObtenerObjetoEvento(System.Data.DataRow fila, System.Data.DataRowView dataRowView, DateTime fechaInicio, DateTime fechaFinal)
{
    object resultado = null;
    try
    {
        if (fila != null)
        {
            var rowNumberValor = "1";
            var tituloValor = fila["Titulo"].ToString();
            var tituloLimitedValor = CMS.GlobalHelper.TextHelper.LimitLength(fila["Titulo"].ToString(), 50, "...", true);
            var resumenValor = fila["Resumen"].ToString();
            var resumenLimitedValor = CMS.GlobalHelper.TextHelper.LimitLength(fila["Resumen"].ToString(), 80, "...", true);
            var urlEventoValor = fila["DocumentUrlPath"].ToString();
            var urlEventoCompletaValor = CMS.GlobalHelper.URLHelper.GetAbsoluteUrl(string.Format("~{0}", fila["DocumentUrlPath"]));
            var fechaInicioValor = ObtenerFecha(fechaInicio);
            var fechaFinalValor = ObtenerFecha(fechaFinal);
            var imagenSmallValor = GSIFunctions.GetGSIImageURLGUID_WithResizeCrop(CMS.GlobalHelper.ValidationHelper.GetGuid(fila["Thumbnail"].ToString(), Guid.Empty), "cms.eventotiempolibre.pl_tiempolibreevento_grande", "383", "216", string.Empty);
            var imagenSmall4_3Valor = GSIFunctions.GetGSIImageURLGUID_WithResizeCrop(CMS.GlobalHelper.ValidationHelper.GetGuid(fila["Thumbnail"].ToString(), Guid.Empty), "cms.eventotiempolibre.pl_tiempolibreevento_grande", "288", "216", string.Empty);
            var imagenHorizontal_Valor = GSIFunctions.GetGSIImageURLGUID_WithResizeCrop(CMS.GlobalHelper.ValidationHelper.GetGuid(fila["Thumbnail"].ToString(), Guid.Empty), "cms.eventotiempolibre.pl_tiempolibreevento_grande", "885", "500", string.Empty);
            var imagenSmallFullSizeValor = GSIFunctions.GetGSIImageURLGUID(CMS.GlobalHelper.ValidationHelper.GetGuid(fila["Thumbnail"].ToString(), Guid.Empty), "cms.eventotiempolibre.pl_tiempolibreevento_grande", "auto", "auto", string.Empty);
            if (!string.IsNullOrEmpty(imagenSmallFullSizeValor) && imagenSmallFullSizeValor.IndexOf("http://gnw.") == -1)
                imagenSmallFullSizeValor = imagenSmallFullSizeValor.Replace("http://", "https://");
            var codigosCategoriasValor = fila["Categorias"].ToString();
            var hoyValor = System.DateTime.Now.ToShortDateString() == fechaInicio.ToShortDateString();
            var promocionValor = !string.IsNullOrEmpty(fila["UrlTicket"].ToString());

            resultado = new
            {
                rowNumber = rowNumberValor,
                titulo = tituloValor,
                tituloLimited = tituloLimitedValor,
                resumen = resumenValor,
                resumenLimited = resumenLimitedValor,
                urlEvento = urlEventoValor,
                urlEventoCompleta = urlEventoCompletaValor,
                codigosCategorias = codigosCategoriasValor,
                fechaInicio = fechaInicioValor,
                fechaFinal = fechaFinalValor,
                hoy = hoyValor,
                promocion = promocionValor,
                imagenSmall = imagenSmallValor,
                imagenSmall4_3 = imagenSmall4_3Valor,
                imagenHorizontal = imagenHorizontal_Valor,
                imagenFullSize = imagenSmallFullSizeValor
            };
        }
    }
    catch (Exception ex)
    {
        resultado = new { error = ex.Message };
    }
    return resultado;
}
                                               
protected object ObtenerFecha(object entrada)
{
    object resultado = null;
    DateTime fecha = CMS.GlobalHelper.ValidationHelper.GetDateTime(entrada, new DateTime(1, 1, 1));
    if (fecha != new DateTime(1, 1, 1))
    {
        resultado = new
        {
            valor = fecha,
            valorCompleto = entrada.ToString(),
            sinHora = fecha.ToShortDateString(),
            dia = fecha.Day,
            diaSemana = fecha.DayOfWeek == DayOfWeek.Monday ? "Lun" : fecha.DayOfWeek == DayOfWeek.Tuesday ? "Mar" : fecha.DayOfWeek == DayOfWeek.Wednesday ? "Mie" : fecha.DayOfWeek == DayOfWeek.Thursday ? "Jue" : fecha.DayOfWeek == DayOfWeek.Friday ? "Vie" : fecha.DayOfWeek == DayOfWeek.Saturday ? "Sab" : fecha.DayOfWeek == DayOfWeek.Sunday ? "Dom": "",
            mes = new
            {
                mes = fecha.Month,
                nombre = PLFunctions.GetMonthName(fecha.Month).Substring(0, 3)
            },
            horaCompleta = fecha.ToString("hh:mm tt").Replace(" a. m.", "am").Replace(" p. m.", "pm"),
            anio = fecha.Year,
            hora = fecha.Hour.ToString().PadLeft(2, '0'),
            minuto = fecha.Minute.ToString().PadLeft(2, '0')
        };
    }
    return resultado;
}
                                                                 
protected List<object> paginarResultado(List<object> entrada, int pagina, int eventosPorPagina)
{
    var resultado = new List<object>();

    var indexMenor = (pagina * eventosPorPagina) - eventosPorPagina;
    var indexMayor = (pagina * eventosPorPagina) - 1;
    for (var x=0; x < entrada.Count; x++)
    {
        if (x >= indexMenor && x <= indexMayor)
            resultado.Add(entrada[x]);
    }
    return resultado;
}
                                                   
private class FechaAgenda
{
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFinal { get; set; }
    public bool Vigente { get; set; }
    
    public FechaAgenda(DateTime pFechaInicio, DateTime pFechaFinal)
    {
        this.FechaInicio = pFechaInicio;
        this.FechaFinal = pFechaFinal;
    }
                                                   
    public virtual List<FechaAgenda> DerivarFechas()
    {
        var resultado = new List<FechaAgenda>();
        if (FechaInicio != null && FechaFinal != null)
        {
            if (FechaInicio < FechaFinal)
            {
                var eventos = int.Parse(Math.Ceiling((FechaFinal - FechaInicio).TotalDays).ToString());

                for (var x = 0; x < eventos; x++)
                {

                    var subFechaInicio = FechaInicio.AddDays(x);
                    var subFechaFinal = FechaFinal.AddDays(x - (eventos - 1));
                    
                    var ahorita = System.DateTime.Now;
                    if (subFechaFinal > new DateTime(ahorita.Year, ahorita.Month, ahorita.Day, 0, 0, 0))
                    {
                        resultado.Add(new FechaAgenda(subFechaInicio, subFechaFinal)
                        {
                            Vigente = subFechaFinal > System.DateTime.Now
                        });
                    }
                }
            }
        }
           
        return resultado;
    }
}
      
private class FechaAgendaRecurrente : FechaAgenda
{
    public FechaAgendaRecurrente(DateTime pFechaInicio, DateTime pFechaFinal) : base(pFechaInicio, pFechaFinal)
    {
        this.FechaInicio = pFechaInicio;
        this.FechaFinal = pFechaFinal;
    }

    public bool Lunes { get; set; }
    public bool Martes { get; set; }
    public bool Miercoles { get; set; }
    public bool Jueves { get; set; }
    public bool Viernes { get; set; }
    public bool Sabado { get; set; }
    public bool Domingo { get; set; }

    public override List<FechaAgenda> DerivarFechas()
    {
        return base.DerivarFechas().Where((x) => {
            if (x.FechaInicio.DayOfWeek == DayOfWeek.Monday && Lunes)
                return true;
            else if (x.FechaInicio.DayOfWeek == DayOfWeek.Tuesday && Martes)
                return true;
            else if (x.FechaInicio.DayOfWeek == DayOfWeek.Wednesday && Miercoles)
                return true;
            else if (x.FechaInicio.DayOfWeek == DayOfWeek.Thursday && Jueves)
                return true;
            else if (x.FechaInicio.DayOfWeek == DayOfWeek.Friday && Viernes)
                return true;
            else if (x.FechaInicio.DayOfWeek == DayOfWeek.Saturday && Sabado)
                return true;
            else if (x.FechaInicio.DayOfWeek == DayOfWeek.Sunday && Domingo)
                return true;
  
            return false;
      }).ToList<FechaAgenda>();
    }
}
</script>

<cms:CMSWebPartZone ZoneID="zoneData" runat="server" />