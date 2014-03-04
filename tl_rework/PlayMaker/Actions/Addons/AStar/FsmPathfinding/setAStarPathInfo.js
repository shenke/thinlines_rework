#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;


@ActionCategory("A Star")
@Tooltip("few very technical things to set. Do not play with this unless you know what you're doing.")


public class setAStarPathInfo extends HutongGames.PlayMaker.FsmStateAction{
		@ActionSection("Input")
		@ObjectType(typeof(FsmAstarPath))
		@Tooltip("Leave this empty if you're using just one graph or if the graph is your active graph")
		public var astarPath : FsmObject;
		
		
		@ActionSection("Astar Data")
		
		@ObjectType(typeof(FsmAstarData))
		@Tooltip("AstarData saves a lot of low level stuff, just like AstarPath. It also exists per graph.")	
		public var astarData : FsmObject;
		
		@ActionSection("Booleans")
		@Tooltip ("Set true when scanning is being done.")
		public var isScanning : FsmBool	;
		
		@Tooltip ("Shows or hides graph inspectors. ")
		public var showGraphs : FsmBool	;
		
		@Tooltip ("The last area index which was used. ")		
		public var lastUniqueAreaIndex : FsmInt;
		
		@ActionSection("graphs...s")
		@ObjectType(typeof(FsmNavGraphs))
		@Tooltip ("All graphs this instance holds.This will be filled only after deserialization has completed. Set it at your own peril :D")		
		public var graphs : FsmObject;
		
		
		
		
		public var everyFrame : FsmBool;
		
		private var astarp : AstarPath;
		
		public function Reset(){
		
			astarPath = new FsmObject(); astarPath.UseVariable = true;
			astarData = FsmObject(); astarData.UseVariable = true;
			isScanning = FsmBool(); isScanning.UseVariable = true;
			showGraphs = FsmBool(); showGraphs.UseVariable = true;
			lastUniqueAreaIndex = FsmInt(); lastUniqueAreaIndex.UseVariable = true;
			graphs = FsmObject(); graphs.UseVariable = true;
			
		}
		
		public function OnEnter() 
	  	{			
			DoStuff();
			if(!everyFrame.Value){Finish();}
			
		}
		
		public function DoStuff(){
		//Input
			if (!astarPath.IsNone && astarPath.Value != null){ //if there but null it also returns false
				astarp = FsmConverter.GetAstarPath(astarPath); // set astard to the given astarPath, if any
			}
			else{
				astarp = AstarPath.active;	// if there's no given astarPath, use active.
			}
			
		//Output	

			
		//Bools
			if(!isScanning.IsNone){
				astarp.isScanning = isScanning.Value ;
			}		
			
			if(!showGraphs.IsNone){
				astarp.showGraphs = showGraphs.Value;
			}
			
		
		//ints
			if(!lastUniqueAreaIndex.IsNone){
				astarp.lastUniqueAreaIndex = lastUniqueAreaIndex.Value;
			}	

		
			
	
		//AstarData
			if (!astarData.IsNone){
				astarp.graphs = FsmConverter.GetNavGraphs(astarData.Value); // set astarData
			}			
			return;
		}
	  
		public function OnUpdate() 
	  	{
			DoStuff();
		}
   	}
	

	//public function Reset(){
	//}

	//public function OnEnter(){
	//var doo : FsmPath = InputPath.Value;
	//}

