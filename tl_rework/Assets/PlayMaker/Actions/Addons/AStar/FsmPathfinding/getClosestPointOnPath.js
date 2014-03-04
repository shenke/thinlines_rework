#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;


@ActionCategory("A Star")
@Tooltip(" This action returns the closest point to a gameObject on a path. It only regards world distance, not the length of the path needed to go there. So while it is cheap on performance and can get you to any path, it may sometimes take you a longer way than needed.")


public class getClosestNodeOnPath extends HutongGames.PlayMaker.FsmStateAction{
		@ActionSection("Input")
		@ObjectType(typeof(FsmPath))
		@Tooltip("the path to check")	
		public var InputPath : FsmObject;
		
		@RequiredField
		@Tooltip("Compare the distance of the items in the list to the position of this gameObject")
		public var DistanceFrom : FsmOwnerDefault;


		@ActionSection("Node")
		@ObjectType(typeof(FsmNode))
		@Tooltip("closest node ")	
		public var node : FsmObject;

		@ActionSection("Vector3")
		@Tooltip("The actual position ")	
		public var position : FsmVector3;
		
		private var goo = new FsmPath();	
		
		
		public function Reset() {
			InputPath = null;
			DistanceFrom = null;
			node = null;
			position = null;
		}
		public function OnEnter() 
	  	{
			var go : FsmPath = InputPath.Value as FsmPath;
			if(typeof(go) == null || go.Value == null) 
			{
				Debug.Log("Input incomplete");
				Finish(); 
				return;
			} // it would continue for a frame without return
			
			var a = 1/0f;
			var doo : FsmPath = InputPath.Value as FsmPath;
			var coo = new FsmNode();
			
			if (doo.Value == null) return;
			
			else {
				var pathNodes = doo.Value.vectorPath;
				 for (var i = 0; i < Enumerable.Count(pathNodes); i++)
				{
					var o = (pathNodes[i] - Fsm.GetOwnerDefaultTarget(DistanceFrom).transform.position).sqrMagnitude;
					if(o < a) {
						position.Value = pathNodes[i];
						coo.Value = doo.Value.path[i];
						a = o;
					}
				}
			}
			node.Value = coo;
			

			Finish();

			
		}
	  
   	}
	


