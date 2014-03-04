#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;


@ActionCategory("A Star")
@Tooltip("set node attributes directly")


public class addNodeConnection extends HutongGames.PlayMaker.FsmStateAction{

		@ActionSection("Any type of node.")
		@Tooltip("The node to be changed")	
		@ObjectType(typeof(FsmNode))
		public var node : FsmObject;
		
		@Tooltip("The costs to traverse from one node to the other. The higher it is, the less likely the actor will use it. Useful for water or otherwise unpreferable grounds.")	
		public var cost : FsmInt;
		

		@Tooltip("The neighbour node")	
		@ObjectType(typeof(FsmNode))
		public var node2 : FsmObject;
		
		@Tooltip("Normally this action creates a one way connection. With this activated, it performs the same action on node2 too.")
		public var pingPong : FsmBool;
		
		public var everyFrame : FsmBool;
		


		public function Reset(){
			node = FsmObject(); 
			cost = 1;
			node2 = FsmObject();
		}
		
      
		public function OnEnter() 
	  	{
			mohogony();
			
			if(!everyFrame.Value){
				Finish();
			}
			
		}
	  
		public function mohogony(){
			var mo : FsmNode = node.Value as FsmNode;
			var fo : FsmNode = node2.Value as FsmNode;
			if((mo.Value == null) || (fo.Value == null)) {Debug.Log("Input Incomplete"); Finish(); return;}
			
			mo.Value.AddConnection(fo.Value as Node, cost.Value); 
			if (pingPong){			
				fo.Value.AddConnection(mo.Value, cost.Value);
			}		
		}
		
		public function OnUpdate() {
			mohogony();
		}
   	}
	

