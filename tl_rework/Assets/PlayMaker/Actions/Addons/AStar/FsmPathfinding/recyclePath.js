#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;
import FsmConverter;


@ActionCategory("A Star")
@Tooltip("Resets and returns a path to the path pool")


public class recyclePath extends HutongGames.PlayMaker.FsmStateAction{
		@ActionSection("Input")
		@ObjectType(typeof(FsmPath))
		@Tooltip("Input Path")	
		public var InputPath : FsmObject;

		
		public function Reset()
		{
			InputPath = null;
			
		}

      
		public function OnEnter() 
	  	{
			var go : FsmPath = InputPath.Value as FsmPath;
			if(go.Value == null) {Finish(); return;}
			throw new System.Exception ("This function should not be used directly. Use path.Release (...) and path.Claim (...) instead. Such an integration is coming soon.");
			
			//PathPool.<ABPath>.Recycle(GetPath(InputPath));
			//Finish();
		}
	
   	}
	 
