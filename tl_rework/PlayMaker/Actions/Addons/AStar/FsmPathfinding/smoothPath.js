#pragma strict

import System;
import HutongGames.PlayMaker;
import FsmPathfinding;
import Pathfinding;
import System.Linq;
import SimpleSmoothModifier;
import FsmConverter;


@ActionCategory("A Star")
@Tooltip("Use this action to smooth a path. Right now there is no smoothing amount available yet, so avoid this on large node sizes")


public class smoothPath extends HutongGames.PlayMaker.FsmStateAction{
		@ActionSection("Input")
		@Tooltip("Really any gameObject does the trick here ^^")
		public var gameObject : FsmOwnerDefault;
		@ObjectType(typeof(FsmPath))
		@Tooltip("Alternatively use a path directly. Overwrites everything else as a path, if set.")	
		public var InputPath : FsmObject;
		
		private var goo : FsmPath;	

      
		public function OnUpdate() 
	  	{	
			goo = InputPath.Value as FsmPath;
			if(goo.Value == null) {Finish(); return;}
			
			if(GetPath(InputPath).vectorPath.Count == 0) {return;} // wait until path's ready
			
			var go = gameObject.OwnerOption == OwnerDefaultOption.UseOwner ? Owner : gameObject.GameObject.Value;
			goo = InputPath.Value as FsmPath;
			var moo = go.AddComponent(SimpleSmoothModifier);
			goo.Value.vectorPath = moo.SmoothSimple (goo.Value.vectorPath);
			Destroy(moo);
			

			
			Finish();

			
		}
	  
   	}
	 



