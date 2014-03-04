#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;


@ActionCategory("A Star")
@Tooltip("This can be used with or without an input variable and can give you a lot of detailled info on your graphs. It's one of the very lowest classes")


public class getAStarPathInfo extends HutongGames.PlayMaker.FsmStateAction{
		@ActionSection("Input")
		@ObjectType(typeof(FsmAstarPath))
		@Tooltip("Leave this empty if you're using just one graph or if the graph is your active graph")
		public var astarPath : FsmObject;
		
		
		@ActionSection("Output")
		
		@ObjectType(typeof(FsmAstarData))
		@Tooltip("AstarData saves a lot of low level stuff, just like AstarPath. It also exists per graph.")	
		public var astarData : FsmObject;
		
		
		@ActionSection("Booleans")
		@Tooltip ("Set true when scanning is being done.")
		public var isScanning : FsmBool	;

		@Tooltip ("Shows or hides graph inspectors. ")
		public var showGraphs : FsmBool	;
		
		@Tooltip ("Used by the editor to show some Pro specific stuff. ")
		public var HasPro : FsmBool	;
		
		@Tooltip ("Returns whether or not multithreading is used.")
		public var IsUsingMultithreading : FsmBool	;
		
		@Tooltip ("Returns whether or not multithreading is used.")
		public var IsAnyGraphUpdatesQueued : FsmBool	;
		
		@ActionSection("Integers")
		@Tooltip ("The last area index which was used. ")		
		public var lastUniqueAreaIndex : FsmInt;
		
		@Tooltip ("Number of threads currently active. ")		
		public var ActiveThreadsCount : FsmInt;
		
		@Tooltip ("	Number of parallel pathfinders. ")		
		public var NumParallelThreads : FsmInt;

		
		@ActionSection("Strings")	
		@Tooltip ("The version number for the A* Pathfinding Project. ")		
		public var Version : FsmString;		

		@ActionSection("graphs...s")
		@ObjectType(typeof(FsmNavGraphs))
		@Tooltip ("All graphs this instance holds.This will be filled only after deserialization has completed")		
		public var graphs : FsmObject;
	
		
		@ActionSection("AstarPaths")
		@ObjectType(typeof(FsmAstarPath))
		@Tooltip("Returns the active AstarPath object in the scene. ")	
		public var activeAstarPath : FsmObject;
		
		
		
		
		public var everyFrame : FsmBool;
		
		private var astarp : AstarPath;
		
		public function Reset(){
			astarPath = null;
			astarData = null;
			isScanning = null;
			showGraphs = null;
			HasPro = null;
			IsUsingMultithreading = null;
			IsAnyGraphUpdatesQueued = null;
			lastUniqueAreaIndex = null;
			ActiveThreadsCount = null;
			NumParallelThreads = null;
			graphs = null;
			Version = null;
			activeAstarPath = null;
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
				isScanning.Value = astarp.isScanning;
			}		
			
			if(!showGraphs.IsNone){
				showGraphs.Value = astarp.showGraphs;
			}
			
			if(!IsUsingMultithreading.IsNone){
				IsUsingMultithreading.Value = astarp.IsUsingMultithreading;
			}	
			
			if(!IsAnyGraphUpdatesQueued.IsNone){
				IsAnyGraphUpdatesQueued.Value = astarp.IsAnyGraphUpdatesQueued;
			}			
		//ints
			if(!lastUniqueAreaIndex.IsNone){
				lastUniqueAreaIndex.Value = astarp.lastUniqueAreaIndex;
			}	
			if(!ActiveThreadsCount.IsNone){
				ActiveThreadsCount.Value = astarp.ActiveThreadsCount;
			}	
			if(!NumParallelThreads.IsNone){
				NumParallelThreads.Value = astarp.NumParallelThreads;
			}	
			
		//strings
			if(!Version.IsNone){
				Version.Value = astarp.Version.ToString();
			}
			
		//graphs
			if(!graphs.IsNone){
				graphs.Value = FsmConverter.SetNavGraphs(astarp.graphs);
			}
		//AstarPaths
			if(!activeAstarPath.IsNone){
				activeAstarPath.Value = FsmConverter.SetAstarPath(astarp.active);
			}	
		//AstarData
			if (!astarData.IsNone){
				astarData.Value = FsmConverter.SetNavGraphs(astarp.graphs); // set astarData
			}			
			return;
		}
	  
		public function OnUpdate() 
	  	{
			DoStuff();
		}
   	}
	

