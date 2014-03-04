#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;


@ActionCategory("A Star")
@Tooltip("Using the Seeker component on a GameObject a path is calculated and then followed.")


public class translatePath extends HutongGames.PlayMaker.FsmStateAction{
		@ActionSection("Input")
		@ObjectType(typeof(FsmPath))
		@Tooltip("Alternatively use a path directly. Overwrites everything else as a path, if set.")	
		public var InputPath : FsmObject;
		
		@Tooltip("Amount of translation")
		public var Vector : FsmVector3;
		
		private var a : Path;
		
		public function Reset()
		{
			InputPath = null;
			Vector = null;
			
		}

      
		public function OnEnter() 
	  	{
			var doo : FsmPath = InputPath.Value as FsmPath; //Input path is the FsmObject variable. The value of it is the FsmPath variable
			//get real path
			a = doo.Value;
			
			if(a == null) {Finish(); return;} // it would continue for a frame without return
			
			var x = 0;
			
			
			
			while (x<a.path.Count)
			{
				//a.path[x].position.x += Vector.Value.x/a.path[x].position.PrecisionFactor;
				//a.path[x].position.y += Vector.Value.y/a.path[x].position.PrecisionFactor;
				//a.path[x].position.z += Vector.Value.z/a.path[x].position.PrecisionFactor;
				a.vectorPath[x] += Vector.Value;


				x++;
			}

			Finish();

			
		}
	  
   	}
	

	//public function Reset(){
	//}

	//public function OnEnter(){
	//var doo : FsmPath = InputPath.Value;
	//}

