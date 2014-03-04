#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;
import AstarPathExtension;

@ActionCategory("A Star")
@Tooltip("Creates a number of nodes with the correct type for the graph. ")


public class createNodes extends HutongGames.PlayMaker.FsmStateAction{

		@ActionSection("Input")
		@RequiredField
		@ObjectType(typeof(FsmNavGraph))
		@Tooltip("The graph")	
		public var graph : FsmObject;
			
		@Tooltip("Used in the editor to check if the info screen is open. ")	
		public var number : FsmInt;
		
		@ActionSection ("Output : Nodes...s")
		@Tooltip("A list of the newly created nodes")
		@ObjectType(typeof(FsmNodes))
		public var nodes : FsmObject;
		
		public var everyFrame : FsmBool;
		
		private var g : NavGraph;
      
		public function Reset(){
		graph = FsmObject();
		nodes = FsmObject();
		number = 0;
		everyFrame = false;
	
		}
		
		public function OnEnter() 
	  	{
			var mo : FsmNavGraph = graph.Value as FsmNavGraph;
			if(mo.Value == null) {Finish(); return;} // it would continue for a frame without return
			
			g = GetNavGraph(graph);
			
			DoStuff();
			
			if (!everyFrame.Value)
			Finish();

			
		}
		
		public function DoStuff(){
			var a = new g.CreateNodes(number.Value);
			
			nodes.Value = FsmNodes();
			
			(nodes.Value as FsmNodes).Value = NodeListToArray(a);
			
		//	g.nodes += a;
			
		//	AstarPath.active.NodeCountChanged() ;

			AstarPathExtensions.ScanGraph(g);

		}

		
		public function OnUpdate()
		{
			DoStuff();
		}
	  
   	}
	


