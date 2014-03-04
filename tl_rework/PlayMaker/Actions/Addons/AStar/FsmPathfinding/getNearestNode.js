#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;
import AstarPathExtension;


@ActionCategory("A Star")
@Tooltip("Using the Seeker component on a GameObject a path is calculated and then followed.")


public class getNearestNode extends HutongGames.PlayMaker.FsmStateAction{
		@ActionSection("Input")
		@RequiredField
		@Tooltip("Aproximate position of node. It will get the closest node to this position. Cheaply.")
		public var Position : FsmVector3;
		
		public var everyFrame : FsmBool;
		
		@ActionSection("Output")
		@Tooltip("The node ")	
		@ObjectType(typeof(FsmNode))
		public var node : FsmObject;

		
		public function Reset() {
		Position = null;
		everyFrame = false;
		node = null;
		}
		
		public function OnEnter() 
	  	{
			if(!node.UseVariable) {Finish(); return;}
			
			mohogony();
			
			var coo : FsmNode = node.Value as FsmNode;
			var foo : Node = (coo as FsmNode).Value;
			
			Debug.Log(foo.area);
			
			if (!everyFrame.Value)
				Finish();

			
		}
		public function mohogony() {
			node.Value = SetNode(AstarPath.active.GetNearest(Position.Value).node as Node);
			return;
		}
		
		public function OnUpdate()
		{
			mohogony();
		}
	  
   	}
	


