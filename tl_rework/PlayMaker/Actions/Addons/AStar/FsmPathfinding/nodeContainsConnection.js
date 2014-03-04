#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;
import AstarPathExtension;

@ActionCategory("A Star")
@Tooltip("set node attributes directly")


public class nodeContainsConnection extends HutongGames.PlayMaker.FsmStateAction{

		@ActionSection("Any type of node.")
		@ObjectType(typeof(FsmNode))
		@Tooltip("node1")	
		public var node : FsmObject;
		
		@Tooltip("node2")	
		public var node2 : FsmObject;
		
		@ActionSection("Output")
		public var connected : FsmBool;
		


		public function Reset(){
			node = null; 
			node2 = null;
			connected = false;
		}
		
      
		public function OnEnter() 
	  	{
			var mo : FsmNode = node.Value as FsmNode;
			var fo : FsmNode =node2.Value as FsmNode; 
			if(typeof(mo) == null || typeof(fo) == null || (mo.Value == null) || (fo.Value == null)) 
			{
				Debug.Log("Input incomplete, node not valid or does not exist. Make sure you assigned it properly.");
				Finish(); 
				return;
			}
			

			var a = (node.Value as FsmNode).Value as Node;

			
			connected.Value = a.ContainsConnection(GetAnythingShallow(node2) as Pathfinding.Node); 
			
			Finish();

			
		}
	  
   	}
	

