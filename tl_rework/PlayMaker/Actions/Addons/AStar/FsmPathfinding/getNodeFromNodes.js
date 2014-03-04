#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;
import FsmConverter;
import System.Collections.Generic;

@ActionCategory("A Star")
@Tooltip("Currently supports both FsmNodes and FsmGridNodes. More to come. Gets a node at a certain index from an array/list of nodes")


public class getNodeFromNodes extends HutongGames.PlayMaker.FsmStateAction{

		@ActionSection("Input")
		@RequiredField
		@ObjectType(typeof(FsmNodes))
		@Tooltip("The nodes ")	
		public var nodes : FsmObject;
		
		@RequiredField
		@Tooltip("Index of the node")	
		public var index : FsmInt;
		
		@ActionSection("Output")
		@ObjectType(typeof(FsmNode))
		@Tooltip("Any type of node")	
		public var node : FsmObject;

		public function Reset(){
			nodes = FsmObject();
			index = 0;
			node = FsmObject();
		}
	  
		public function OnEnter()  
	  	{
			var mo : FsmNodes = nodes.Value as FsmNodes;
			if( typeof(mo) == null || (mo.Value == null) || !node.UseVariable) {
				Debug.Log("No Input");
				Finish(); 
				return;
			} 
			if ((mo.Value as List.<Node>).Count <= index.Value)
			{
				Debug.Log("index is higher than the number of nodes in the nodes list/variable");
				Finish();
				return;
			}

			node.Value = SetNode((nodes.Value as FsmNodes).Value[index.Value]);

			Finish();

			
		}
	  
   	}
	


