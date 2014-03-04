#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;


@ActionCategory("A Star")
@Tooltip("get various properties of the path. Get properties does not work due to the wrappers.")


public class getPathInfo extends HutongGames.PlayMaker.FsmStateAction{
		@ActionSection("Input")
		@ObjectType(typeof(FsmPath))
		@Tooltip("Alternatively use a path directly. Overwrites everything else as a path, if set.")	
		public var InputPath : FsmObject;
		
		@ActionSection("Output - Floats")
		@Tooltip("The real length of the path")	
		public var Length : FsmFloat;
		
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
		@Tooltip("Calculate partial path if the target node cannot be reached. ")	
		public var IsDone : FsmBool;

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
			InputPath = FsmObject();
			Length = FsmFloat();
			duration = FsmFloat();
			heuristicScale = FsmFloat();
			
			enabledTags = FsmInt();
			radius = FsmInt();
			pathID = FsmInt();
			searchedNodes = FsmInt();
			searchIterations = FsmInt();
			speed = FsmInt();
			turnRadius = FsmInt();
			IsDone = FsmBool();
			recycled = FsmBool();
			nnConstraint = FsmObject();
			nodes = FsmObject();
			runData = FsmObject();
			
		}
		
		public function OnEnter() 
	  	{
			if(typeof(InputPath.Value) == null || typeof(InputPath.Value) == typeof(UnityEngine.Object) || (InputPath.Value as FsmPath).Value == null) 
			{
				Debug.Log("Input Path is invalid. Make sure that the path is completely created (many actions do not finish in the same frame as they start) ");
				Finish(); 
				return;
			}
			DoStuff();
			if(!everyFrame.Value)Finish();
			
		}

		public function DoStuff(){
			var doo : FsmPath = InputPath.Value as FsmPath;
			
			if(doo.Value == null){Finish(); return;}
			

			
			//floats
			Length.Value = doo.Value.GetTotalLength();
			duration.Value = doo.Value.duration;
			heuristicScale.Value = doo.Value.heuristicScale;
			
			//ints
			enabledTags.Value = doo.Value.enabledTags;			
			radius.Value = doo.Value.radius;
			pathID.Value = doo.Value.pathID;
			searchedNodes.Value = doo.Value.searchedNodes;
			searchIterations.Value = doo.Value.searchIterations;
			speed.Value = doo.Value.speed;
			turnRadius.Value = doo.Value.turnRadius;

			//bools
			IsDone.Value = doo.Value.IsDone ();
			recycled.Value = doo.Value.recycled;
			
			
			//NNConstraints
			var noo = new FsmNNConstraint();
			noo.Value = doo.Value.nnConstraint;
			nnConstraint.Value = noo;
			
			//Nodes[]
			var coo = new FsmNodes();
			coo.Value = doo.Value.path;
			nodes.Value = coo;
			
			//NodeRunData
			var roo = new FsmNodeRunData();
			roo.Value = doo.Value.runData;
			runData.Value = roo;
			
		}
	  
		public function OnUpdate() 
	  	{
			DoStuff();
		}
   	}


