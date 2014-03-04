#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;


@ActionCategory("A Star")
@Tooltip("Using the Seeker component on a GameObject a path is calculated and then followed.")


public class getNodeInfo extends HutongGames.PlayMaker.FsmStateAction{

		@ActionSection("Input")
		@RequiredField
		@ObjectType(typeof(FsmNode))
		@Tooltip("The node")	
		public var node : FsmObject;
		
		@ActionSection("Output")
		@Tooltip("Returns the global node index")	
		public var nodeIndex : FsmInt;
		
		@Tooltip("Penlty cost for walking on this node. ")	
		public var penalty : FsmInt;
		
		@Tooltip("Area ID of the node. ")	
		public var area : FsmInt;
		
		@Tooltip("The index of the graph this node is in. ")	
		public var graphIndex : FsmInt;
		
		@Tooltip("Tags for walkability.")	
		public var tags : FsmInt;
		
		@Tooltip("Tags for walkability.")	
		public var walkable : FsmBool;
		
		@Tooltip("Is the node walkable. ")		
		public var position : FsmVector3;
		
		@Tooltip("Nodes : every node that is connected to this one.")	
		public var connectedNodes : FsmObject;
		
		@Tooltip ("The graph the node is contained in")
		@ObjectType(typeof(FsmNavGraph))
		public var graph : FsmObject;

		public var everyFrame : FsmBool;
		
		
		
      
		public function Reset(){
		node = FsmObject();
		nodeIndex = null;
		penalty = null;
		area = null;
		graphIndex = null;
		tags = null;
		walkable = null;
		position = null;
		connectedNodes = FsmObject(); connectedNodes.UseVariable = true;
		
		}
	  
		public function OnEnter() 
	  	{
			
			
			var mo : FsmNode = node.Value as FsmNode;
			Debug.Log(typeof(mo));
			if(typeof(mo) == null || mo.Value == null) 
			{
				Debug.Log("input invalid. Make sure the node is properly assigned.");
				Finish();
				return;
			}
			DoStuff();
			
			if (!everyFrame.Value)
			Finish();

			
		}
	  
		public function DoStuff(){
		
			var doo : Node = ((node as FsmObject).Value as FsmNode).Value as Node;
			
			nodeIndex.Value = doo.GetNodeIndex();
			
			penalty.Value = doo.penalty;
			
			area.Value = doo.area;
			
			tags.Value = doo.tags;
			
			walkable.Value = doo.walkable;
			
			graphIndex.Value = doo.graphIndex;
			
			position.Value = new Vector3(doo.position.x,doo.position.y,doo.position.z);
			position.Value *= doo.position.PrecisionFactor;
			
			if (!connectedNodes.IsNone)
			(connectedNodes.Value as FsmNodes).Value = NodeListToArray(doo.connections);
			
			var loo : FsmNavGraph = new FsmNavGraph();
			loo.Value = AstarPath.active.graphs[doo.graphIndex];
			graph.Value = loo;

		}
		
		public function OnUpdate()
		{
			DoStuff();
		}
	  
   	}
	

