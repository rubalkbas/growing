<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Recibo_model extends CI_Model {	
	const DB_COMENTARIOS = 'RECIBOS_D_COMENTARIOS';	
	const DB_DESCARGA = 'RECIBOS_D_DESCARGA';
	public function __construct()
	{
		//$DB2 = $this->load->database('aws', TRUE);
		parent::__construct();
	}

	public function getDatosEmpleado()
	{
		$no_empleado = $this->session->userdata('NO_EMPLEADO');

		
		

		$query = $this->db->query("SELECT e.* FROM RECTEL_EMPLEADOS_V e  WHERE e.emp_keyemp = ".$no_empleado." ");
		if ($query->num_rows()) {
			return $query->row();
		}
		else{
			return false;
		}
	}
	public function guardaComentario($data=array())
	{
		$DB2 = $this->load->database('aws',TRUE);	
		$DB2->insert(self::DB_COMENTARIOS, $data);
	}
	public function getRecibo()
	{
		$no_empleado = $this->session->userdata('NO_EMPLEADO');
		//$queryCurp= $this->db->query("SELECT EMP_RECURP FROM LABPROD.RECTEL_EMPLEADOS_V e WHERE e.emp_keyemp = ".$no_empleado." ");
		
		//$no_empleado =8300034;
		$this->db->query("ALTER SESSION SET NLS_DATE_FORMAT='DD/MM/YYYY'");

		$query = $this->db->query("select distinct(c.per_keyper),c.per_fecpag,c.his_keypro,c.per_keyper,e.*,c.importe
from RECTEL_EMPLEADOS_V e inner join 
RECTEL_CONCEPTOS_V c on (e.emp_keyemp = c.emp_keyemp and e.emp_keypro = c.HIS_KEYPRO)
where e.EMP_RECURP in (SELECT EMP_RECURP FROM RECTEL_EMPLEADOS_V e WHERE e.emp_keyemp = ".$no_empleado.") and c.per_keyper > '2020020' AND 
(per_keyper not like '202%6%' and per_keyper not like '202%1%' AND per_keyper 
not like '202%5%' AND per_keyper not like '202%2%' and per_keyper not like 
'202%6%' and per_keyper not like '202%1%' and per_keyper not like '202%5%' and 
per_keyper not like '202%2%' and per_keyper not like '202%405' and per_keyper not like '202%406' and per_keyper not like '2022406' and per_keyper not like '2022405') order by c.per_fecpag desc");
	
	/*$query = $this->db->query("select distinct(c.periodo),c.fecha_pago,c.periodo,e.* from reci_d_empleados e inner join RECI_D_CONCEPTOS c on (e.no_empleado = c.no_empleado)  where e.no_empleado = ".$no_empleado." order by c.periodo asc");*/
		//echo $this->db->last_query();
		//exit;
		if ($query->num_rows()) {
			return $query->result();
		}
		else{
			return false;
		}


	}
	public function getProceso()
	{
		$no_empleado = $this->session->userdata('NO_EMPLEADO');
		
		//$no_empleado =8300034;
		$this->db->query("ALTER SESSION SET NLS_DATE_FORMAT='DD/MM/YYYY'");
		$query = $this->db->query("SELECT emp_keypro FROM RECTEL_EMPLEADOS_V e   where e.emp_keyemp =".$no_empleado." ");
		//$query = $this->db->query("SELECT CVE_PROCESO FROM reci_d_empleados e   where e.no_empleado = ".$no_empleado." ");
		if ($query->num_rows()) {
			return $query->row();
		}
		else{
			return false;
		}

	}
	public function getRecibo_by_id($periodo,$proceso,$no_empleado)
	{
		//$no_empleado = $this->session->userdata('NO_EMPLEADO');
		
		//$no_empleado =8300034;
		$this->db->query("ALTER SESSION SET NLS_DATE_FORMAT='DD/MM/YYYY'");

		$query = $this->db->query("SELECT E.*,C.* 
									FROM RECTEL_EMPLEADOS_V e  
									inner join RECTEL_CONCEPTOS_V c on (e.emp_keyemp = c.emp_keyemp) 
								 
									where e.emp_keyemp =  ".$no_empleado." and c.per_keyper = '".$periodo."'
									and c.his_keypro = ".$proceso." and ((c.his_codimp = '01' and c.importe > 0 or c.his_keycon = 'M07'  )or c.his_codimp in ('02','03') )  ");
		
		//$query = $this->db->query("SELECT E.*,C.*,d.tipo FROM reci_d_empleados e  inner join RECI_D_CONCEPTOS c on (e.no_empleado = c.no_empleado) INNER JOIN RECI_C_DESCRIPCION_C D ON (c.CVE_CONCEPTO = d.codigo) where e.no_empleado = ".$no_empleado." and c.periodo = '".$periodo."'");
		if ($query->num_rows()) {
			return $query->result();
		}
		else{
			return false;
		}


	}
	public function getAcumP($fechaPago,$anio,$proceso,$no_empleado)
	{
		//$no_empleado = $this->session->userdata('NO_EMPLEADO');
		$fechaA = explode("/",$fechaPago);	
		//$no_empleado =8300034;
		$this->db->query("ALTER SESSION SET NLS_DATE_FORMAT='DD/MM/YYYY'");

		$query =  $this->db->query("SELECT sum(importe) AS PERCEP_ACUMU
FROM  RECTEL_CONCEPTOS_V WHERE his_keycon ='260' AND emp_keyemp = '".$no_empleado."'
									AND per_keyper IN 
									(
									    SELECT distinct(per_keyper) FROM RECTEL_PERIODOS_V p  
									    WHERE per_fecpag BETWEEN '01/01/".$fechaA[2]."' AND '".$fechaPago."'
									    AND per_fecact IS NOT NULL
									    AND per_keypro = ".$proceso." 
									    AND (per_keyper not like '".$fechaA[2]."1%' AND per_keyper not like '".$fechaA[2]."5%' AND per_keyper not like '".$fechaA[2]."2%')
OR (
                                            per_fecpag BETWEEN '01/01/".$fechaA[2]."' AND '".$fechaPago."'  
                                            and per_keyper IN ('".$fechaA[2]."407','".$fechaA[2]."461','".$fechaA[2]."491','".$fechaA[2]."481','".$fechaA[2]."470','".$fechaA[2]."471')
)                                        						
	)");	
		/*$query =  $this->db->query("SELECT sum(importe) AS PERCEP_ACUMU FROM reci_d_conceptos WHERE cve_concepto ='260' AND no_empleado = '".$no_empleado."' 
									AND periodo IN 
									(
									    SELECT distinct(periodo) FROM reci_d_periodos p  
									    WHERE fecha_pago BETWEEN '01/01/".$anio."' AND '".$fechaPago."' 
									    AND fecha_act IS NOT NULL
									    AND cve_proceso = ".$proceso." 
									    AND (periodo not like '".$anio."1%' AND periodo not like '".$anio."5%' AND periodo not like '".$anio."4%' AND periodo not like '".$anio."2%')
									)");*/
		if ($query->num_rows()) {
			return $query->row();
		}
		else{
			return false;
		}
	}
	public function getAcumI($fechaPago,$anio,$proceso,$no_empleado)
	{
		//$no_empleado = $this->session->userdata('NO_EMPLEADO');
		$fechaA = explode("/",$fechaPago);
		//$no_empleado =8300034;
		$this->db->query("ALTER SESSION SET NLS_DATE_FORMAT='DD/MM/YYYY'");
		$query =  $this->db->query("SELECT SUM(importe) AS ISR_ACUMU FROM RECTEL_CONCEPTOS_V WHERE his_keycon IN ('100','151','174','47A','619','294') 
AND			emp_keyemp = '".$no_empleado."' 
								AND per_keyper IN 
								(
								     SELECT distinct(per_keyper) FROM RECTEL_PERIODOS_V p  
									    WHERE per_fecpag BETWEEN '01/01/".$fechaA[2]."' AND '".$fechaPago."' 
									    AND per_fecact IS NOT NULL
									    AND per_keypro = ".$proceso." 
									    AND (per_keyper not like '".$fechaA[2]."1%' AND per_keyper NOT LIKE '".$fechaA[2]."5%' AND per_keyper NOT LIKE '".$fechaA[2]."2%')
 OR (
                                            per_fecpag BETWEEN '01/01/".$fechaA[2]."' AND '".$fechaPago."'  
                                            and per_keyper IN ('".$fechaA[2]."407','".$fechaA[2]."461','".$fechaA[2]."491','".$fechaA[2]."481','".$fechaA[2]."470','".$fechaA[2]."471'))                                   
 )");

		/*$query =  $this->db->query("SELECT SUM(importe) AS ISR_ACUMU FROM reci_d_conceptos WHERE cve_concepto IN ('100','151','174','47A','619','294') AND 								no_empleado = '".$no_empleado."' 
								AND periodo IN 
								(
								    SELECT distinct(periodo) FROM reci_d_periodos p  
								    WHERE fecha_pago BETWEEN '01/01/".$anio."' AND '".$fechaPago."' 
								    AND fecha_act IS NOT NULL 
								    AND cve_proceso = ".$proceso." 
								    AND (periodo not like '".$anio."1%' AND periodo NOT LIKE '".$anio."5%' AND periodo NOT LIKE '".$anio."4%' AND periodo NOT LIKE '".$anio."2%')
								)");*/
		if ($query->num_rows()) {
			return $query->row();
		}
		else{
			return false;
		}
	}
	public function fechaPagoFol($folio,$proceso)
		{
			$this->db->query("ALTER SESSION SET NLS_DATE_FORMAT='DD/MM/YYYY'");
		$query =  $this->db->query("SELECT per_fecpag FROM RECTEL_PERIODOS_V WHERE per_keyper = ".$folio." AND per_keypro = ".$proceso."");
		//$query =  $this->db->query("SELECT FECHA_PAGO FROM reci_d_periodos WHERE PERIODO = ".$folio." AND CVE_PROCESO = ".$proceso."");
		if ($query->num_rows()) {
			return $query->row();
		}
		else{
			return false;
		}
			
	}
	public function getPrestamos($folio,$no_empleado)
		{
			//$no_empleado = $this->session->userdata('NO_EMPLEADO');
			
			//$no_empleado =8300034;
			$this->db->query("ALTER SESSION SET NLS_DATE_FORMAT='DD/MM/YYYY'");
		
			$query =  $this->db->query("SELECT pre_keycon,con_descon,sum(pre_imppre) as importe,sum(pre_impdes) as descuento 
from RECTEL_PRESTAMOS_V P where per_keyper = ".$folio." and pre_keyemp = '".$no_empleado."' group by pre_keycon,con_descon");
		//$query =  $this->db->query("SELECT cve_concepto,desc_concepto,sum(importe) as importe,sum(descuento) as descuento from RECI_D_PRESTAMOS P where periodo = ".$folio." and no_empleado = '".$no_empleado."' group by cve_concepto,desc_concepto");
		if ($query->num_rows()) {
			return $query->result();
		}
		else{
			return false;
		}
			
		}
	public function getUser($no_empleado)
		{
			//$no_empleado = $this->session->userdata('NO_EMPLEADO');
	
			//$no_empleado =8300034;
			$query = $this->db->query("SELECT * FROM RECTEL_EMPLEADOS_V WHERE emp_keyemp = '".$no_empleado."'");
			//$query = $this->db->query("SELECT * FROM reci_d_empleados WHERE no_empleado = '".$no_empleado."'");
			//echo $this->db->last_query(); die();
			if ($query->num_rows()) {
				return $query->row();
			}
			else{
			return false;
			}
		}	
 	public function guardaRegistro($data=array()){
		$DB = $this->load->database('aws',TRUE);
		$DB->query("alter session set nls_date_format='dd/mm/yyyy hh24:mi:ss'");
		$DB->query("INSERT INTO RECIBOS_D_DESCARGA
				 (NO_EMPLEADO,PERIODO_DESCARGADO,FECHA_DESCARGA)
			   VALUES
				 (".$data['NO_EMPLEADO'].",".$data['PERIODO_DESCARGADO'].",to_char(CURRENT_TIMESTAMP,'dd/mm/yyyy hh24:mi:ss'))"); 
	}
	public function getNoEmpleados($curp)
	{
		$query = $this->db->query("SELECT emp_keyemp from RECTEL_EMPLEADOS_V where EMP_RECURP = '".$curp."'");
			//$query = $this->db->query("SELECT * FROM reci_d_empleados WHERE no_empleado = '".$no_empleado."'");
			if ($query->num_rows()) {
				return $query->result();
			}
			else{
			return false;
			}
		
	}
	public function getListRecibos($noEmpleados)
	{
		
		$this->db->query("ALTER SESSION SET NLS_DATE_FORMAT='DD/MM/YYYY'");
		$query = $this->db->query("SELECT distinct per_keyper,emp_keyemp, his_keypro,per_fecpag,
                        CASE 
                             WHEN per_keyper = 2021462 and his_keycon = '025' and importe > 0 THEN 'SI'
                             WHEN PER_KEYPER = 2022407 AND his_keypro = 211 THEN 'NO'
                             WHEN PER_KEYPER = 2022407 AND his_keypro = 214 THEN 'NO'
                             WHEN PER_KEYPER = 2022407 AND his_keypro = 215 THEN 'NO'
                             WHEN PER_KEYPER = 2022407 AND his_keypro = 220 THEN 'NO'
                             WHEN PER_KEYPER = 2022407 AND his_keypro = 313 THEN 'NO'
                             WHEN PER_KEYPER = 2022407 AND his_keypro = 352 THEN 'NO'
                             WHEN PER_KEYPER = 2022407 AND his_keypro = 354 THEN 'NO'
                             WHEN PER_KEYPER = 2022407 AND his_keypro = 376 THEN 'NO'
                             WHEN PER_KEYPER = 2022407 AND his_keypro = 378 THEN 'NO'
                             WHEN per_keyper != 2021462 THEN 'SI'
                        ELSE 'NO'
                        END AS SIVA     
                 from  RECTEL_CONCEPTOS_V where emp_keyemp in (".$noEmpleados.") 
                and per_keyper > '2021002' AND PER_FECPAG <= (SYSDATE +2) AND (per_keyper not like '20226%' and per_keyper not like '20221%' AND per_keyper
                not like '20225%' AND per_keyper not like '20222%' and per_keyper not like
                '20216%' and per_keyper not like '20211%' and per_keyper not like '20215%' and
                per_keyper not like '20212%' and per_keyper not like '202%405' and per_keyper not like '202%406' 
                ) order by per_fecpag desc");
			//$query = $this->db->query("SELECT * FROM reci_d_empleados WHERE no_empleado = '".$no_empleado."'");
			if ($query->num_rows()) {
				return $query->result();
			}
			else{
			return false;
			}
	}	

}

