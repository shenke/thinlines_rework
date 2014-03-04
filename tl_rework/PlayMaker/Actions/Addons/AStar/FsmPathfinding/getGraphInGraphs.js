#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;


@ActionCategory("A Star")
@Tooltip("Using the Seeker component on a GameObject a path is calculated and then followed.")


public class getGraphInGraphs extends HutongGames.PlayMaker.FsmStateAction{

		@ActionSection("Input")
		@RequiredField
		@ObjectType(typeof(FsmNavGraphs))
		@Tooltip("Constraint for how to search for graphs. ")	
		public var graphs : FsmObject;
		
		@RequiredField
		@Tooltip("Index of the graph")	
		public var index : FsmInt;
		
		@ActionSection("Output")
		@ObjectType(typeof(FsmNavGraph))
		@Tooltip("The graph ")	
		public var graph : FsmObject;

		public function Reset(){
			graphs = FsmObject();
			index = 0;
			graph = FsmObject();
		}
	  
		public function OnEnter() 
	  	{
			var go : FsmNavGraphs = graphs.Value as FsmNavGraphs;
			if((go.Value == null) || !graph.UseVariable) {Finish(); return;} // it would continue for a frame without return
			
			
			var goo = GetNavGraphs(graphs);
			var coo = new FsmNavGraph();
			
			if(index.Value>=goo.Length) //check if the index exists
			{
				Finish();
			}
			
			coo.Value = goo[index.Value];

			graph.Value = coo;
			

			
			Finish();

			
		}
	  
   	}
	

