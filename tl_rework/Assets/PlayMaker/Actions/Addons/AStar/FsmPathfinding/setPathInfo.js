#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;


@ActionCategory("A Star")
@Tooltip("Set various properties of the path. Set properties does not work due to the wrappers.")


public class setPathInfo extends HutongGames.PlayMaker.FsmStateAction{
		@ActionSection("Input")
		@ObjectType(typeof(FsmPath))
		@Tooltip("Alternatively use a path directly. Overwrites everything else as a path, if set.")	
		public var InputPath : FsmObject;

		@ActionSection("Floats")
		
		@Tooltip("The duration of this path in ms. ")	
		public var duration : FsmFloat;
		
		@Tooltip("Scale of the heuristic values. ")	
		public var heuristicScale : FsmFloat;
		
		@ActionSection("Integers")
		@Tooltip("Which graph tags are traversable. ")
		public var enabledTags : FsmInt;
		
		@Tooltip("Radius for the unit searching for the path. Not used by any built-in pathfinders. These common name variables are put here because it is a lot faster to access fields than, for example make use of a lookup table (e.g dictionary). Or having to cast to another path type for acess. ")
		public var radius : FsmInt;
		
		@Tooltip("ID of this path. ")
		public var pathID : FsmInt;
		
		@Tooltip("Number of nodes this path has searched. ")
		public var searchedNodes : FsmInt;
		
		@Tooltip("ID of this path. ")
		public var searchIterations : FsmInt;
		
		@Tooltip("Speed of the character. ")
		public var speed : FsmInt;
		
		@Tooltip("Turning radius of the character. ")
		public var turnRadius : FsmInt;
		
		
		@ActionSection("Bools")

		@Tooltip("True if the path is currently recycled (i.e in the path pool). ")	
		public var recycled : FsmBool;
		
		@ActionSection("NNConstraints")
		@ObjectType(typeof(FsmNNConstraint))
		@Tooltip("Constraint for how to search for nodes. ")	
		public var nnConstraint : FsmObject;

		@ActionSection("Nodes...s")
		@ObjectType(typeof(FsmNodes))
		@Tooltip("Constraint for how to search for nodes. ")	
		public var nodes : FsmObject;

		@ActionSection("NodeRunData")
		@ObjectType(typeof(FsmNodeRunData))
		@Tooltip("Constraint for how to search for nodes. ")	
		public var runData : FsmObject;
		
		public var everyFrame : FsmBool;
		
		private var goo = new FsmPath();	

		public function Reset() {
		
			duration = FsmFloat(); duration.UseVariable = true;
			heuristicScale = FsmFloat(); heuristicScale.UseVariable = true;
			
			enabledTags = FsmInt(); enabledTags.UseVariable = true;
			radius = FsmInt(); radius.UseVariable = true;
			pathID = FsmInt(); pathID.UseVariable = true;
			searchedNodes = FsmInt(); searchedNodes.UseVariable = true;
			searchIterations = FsmInt(); searchIterations.UseVariable = true;
			speed = FsmInt(); speed.UseVariable = true;
			turnRadius = FsmInt(); turnRadius.UseVariable = true;
			recycled = FsmBool(); recycled.UseVariable = true;
			nnConstraint = FsmObject(); nnConstraint.UseVariable = true;
			nodes = FsmObject(); nodes.UseVariable = true;
			runData = FsmObject(); runData.UseVariable = true;
			
		}
 
		public function OnEnter() 
	  	{
			var moo : FsmPath = InputPath.Value as FsmPath;
			if(moo.Value == null) {Finish(); return;}
			DoStuff();
			if(!everyFrame.Value)Finish();
			
		}
		
		public function DoStuff(){
			var doo : Path = GetPath(InputPath);
			
			//floats
			doo.duration = duration.Value;
			doo.heuristicScale = heuristicScale.Value;
			
			//ints
			doo.enabledTags = enabledTags.Value;			
			doo.radius = radius.Value;
			doo.pathID = pathID.Value;
			doo.searchedNodes = searchedNodes.Value;
			doo.searchIterations = searchIterations.Value;
			doo.speed = speed.Value;
			doo.turnRadius = turnRadius.Value;

			//bools
			doo.recycled = recycled.Value;
			
			
			//NNConstraints

			nnConstraint.Value = SetNNConstraint(doo.nnConstraint);
			
			//Nodes[]
			nodes.Value = SetNodes(doo.path);
			
			//NodeRunData
			
			runData.Value = SetNodeRunData(doo.runData);
			
		}

	  
		public function OnUpdate() 
	  	{
			DoStuff();
		}
   	}
	



