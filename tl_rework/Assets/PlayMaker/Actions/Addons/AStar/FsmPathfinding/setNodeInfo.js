#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;


@ActionCategory("A Star")
@Tooltip("set node attributes directly")


public class setNodeInfo extends HutongGames.PlayMaker.FsmStateAction{

		@ActionSection("Input")
		@RequiredField
		@ObjectType(typeof(FsmNode))
		@Tooltip("The node")	
		public var node : FsmObject;
		
		@Tooltip("Penlty cost for walking on this node. ")	
		public var penalty : FsmInt;
		
		@Tooltip("Tags for walkability.")	
		public var tags : FsmInt;
		
		@Tooltip("Tags for walkability.")	
		public var walkable : FsmBool;
		
		@Tooltip("node position. Change at your own risk.")		
		public var position : FsmVector3;
		
		public var everyFrame : FsmBool;

		public function Reset(){
			node = FsmObject(); node.UseVariable = true;
			penalty = FsmInt(); penalty.UseVariable = true;
			tags = FsmInt(); tags.UseVariable = true;
			walkable = FsmBool(); walkable.UseVariable = true;
			position = FsmVector3(); position.UseVariable = true;
		}
      
		public function OnEnter() 
	  	{
			var moo : FsmNode = node.Value as FsmNode;
			if(moo.Value == null) {Finish(); return;}
			
			mohogony();
			
			if(!everyFrame.Value)
			Finish();

			
		}
	  
		public function OnUpdate()
		{
			mohogony();
		}
	  
		public function mohogony()
		{
			var doo : FsmNode = node.Value as FsmNode;
			
			if (!penalty.IsNone)
			doo.Value.penalty = penalty.Value;
			
			if (!tags.IsNone)
			doo.Value.tags = tags.Value;
			
			if (!walkable.IsNone) {
				doo.Value.walkable = walkable.Value;
				doo.Value.UpdateNeighbourConnections ();
				doo.Value.UpdateConnections ();
			
			}
			if (!position.IsNone){
			doo.Value.position = new Int3(position.Value.x,position.Value.y,position.Value.z);
			}	  
		}
	  
   	}
	



