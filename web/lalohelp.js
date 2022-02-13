// Globals for HElP content
var htmlspace = "&nbsp;";
var htmltab = htmlspace+htmlspace+htmlspace+htmlspace; 
var htmlmatrix = "<a href='lalolib.html#matrix' target='_blank'>matrix</a>"; 
var htmlvector = "<a href='lalolib.html#vector' target='_blank'>vector</a>";
var HELPcontent = new Array();
var pathToBook = "../book/en/";

//////////////////////////
/// Help functions
//////////////////////////
var helplocked = false;

function help(cmd , forceshow ) {
	if ( !helplocked || forceshow ) {
		if ( cmd == "transpose")
			cmd = "' (transpose)";
		var cmdhelp = HELPcontent[cmd]; 
		if ( cmdhelp ) {
			var htmlhelp = "<h2>" + cmdhelp[1] + "</h2>";
			htmlhelp += "<h4>" + cmdhelp[2].split("\n").join("<br>") + "</h4>";
			htmlhelp += "<p class='helpcontent'>" + cmdhelp[3] + "</p>";
		
			if ( cmdhelp[5] ) {
				if ( typeof(cmdhelp[5]) == "string" ) {
					htmlhelp += "<p class='helpcontent'><a target='_blank' href='" + pathToBook + cmdhelp[5] + "'>More information on this topic.</a></p>";	
				}
				else {
					htmlhelp += "<p class='helpcontent'>For more information on this topic, see <a target='_blank' href='" + pathToBook  + cmdhelp[5][0] + "'>" + cmdhelp[5][0] + "</a>"; 
					for ( var l = 1 ; l < cmdhelp[5].length; l++) {
						htmlhelp += ", <a target='_blank' href='" + pathToBook  + cmdhelp[5][1] + "'>" + cmdhelp[5][1] + "</a>" ; 
					}
					htmlhelp += "</p>";
				}
			}
		
			if(  cmdhelp[4] ) {
				if ( typeof( cmdhelp[4] ) == "string" ) {
					// single example
					htmlhelp += "<strong>Example:</strong><pre>" +  cmdhelp[4] + "</pre>";
					ExampleClipboard[0] = cmdhelp[4];
						if (!self.hasOwnProperty("__INLALOLIBHTMLPAGE")) 
							htmlhelp += "<button id='copyexampletocmdblock' class='topbuttons' onclick='cmdblock.value=ExampleClipboard[0];'>Copy to multi-line input</button>";
				}
				else {
					// more examples
					for ( var l = 0; l < cmdhelp[4].length; l++) {
						htmlhelp += "<strong>Example " + (l+1) + ":</strong><pre>" +  cmdhelp[4][l] + "</pre>";
						ExampleClipboard[l] = cmdhelp[4][l];
						if (!self.hasOwnProperty("__INLALOLIBHTMLPAGE")) 
							htmlhelp += "<button class='topbuttons' onclick='cmdblock.value=ExampleClipboard[" + l + "];'>Copy to multi-line input</button><br><br>";
					}
				}
			}
				
			helpview.innerHTML = htmlhelp;
		
			if ( domathjax && typeof(MathJax) != "undefined" && MathJax.isReady) {
				helpview.focus(); 
				helpview.blur();
				MathJax.Hub.Queue(["Typeset",MathJax.Hub,helpview]);		
			}
		}
		
		if ( forceshow ) 
			helplocked = true;
	}
}
function populateHelp() {
	var c;
	var category;
	var sections = ["Welcome", "Basics"]; // default sections
	for ( c in HELPcontent ) {
		if (HELPcontent.hasOwnProperty(c) )  {
			
			if ( sections.indexOf(HELPcontent[c][0]) == -1) {
				// create new HELP section
				sections.push(HELPcontent[c][0]);
				var subname = HELPcontent[c][0].substr(1); 
				var prettyname = HELPcontent[c][0][0];
				for ( var i=0; i < subname.length; i++) {
					var ci = subname.charAt(i)
					if (ci == ci.toUpperCase() )
						prettyname += " " + subname.charAt(i).toLowerCase();
					else
						prettyname += subname.charAt(i);
				}

				helpcmds.innerHTML += '<p class="helpsectiontitle" onclick=\'toggleHelp(\"' + HELPcontent[c][0] + '\");\'>' + prettyname + ' <label id="helptogglebtn' + HELPcontent[c][0] + '" class="helptogglebtn">+</label></p><div id="helpcmds' + HELPcontent[c][0] + '" class="helpsection"></div>';

			}
			
			if (HELPcontent[c][0] != "Welcome" || !self.hasOwnProperty("__INLALOLIBHTMLPAGE") ) {
				category = document.getElementById("helpcmds" + HELPcontent[c][0]);
				
				if ( c.indexOf("transpose") >=0 )
					category.innerHTML += "<a class='helpcmd' onmouseenter='help(\"transpose\");'  onclick='help(\"transpose\", true);' >" + c + "</a><br>";
				else if ( c.indexOf("\\") >= 0 ) 
					category.innerHTML += "<a class='helpcmd' onmouseenter='help(\"solve\");' onclick='help(\"solve\" , true);'  >" + c + "</a><br>";					
				else									
					category.innerHTML += "<a class='helpcmd' onmouseenter='help(\"" + c + "\");' onclick='help(\"" + c + "\", true);' >" + c + "</a><br>";	
			}
			
		}
	}
	//category.innerHTML += "<br>";
	for (c in sections) {
		if ( sections[c] != "Welcome") {
			category = document.getElementById("helpcmds" + sections[c]);
			category.innerHTML += "<label class='helptogglebtn' onclick='toggleHelp(\"" + sections[c] + "\");'>--</label><br>";
		}
	}
	
	if (!self.hasOwnProperty("__INLALOLIBHTMLPAGE")) {
		helpcmds.innerHTML += "<p><a href='toolboxes.html' target='_blank'>Add a toolbox...</a></p>";
	
		help("LALOLab");
	}
}

function toggleHelp( section ) {
	var sec = document.getElementById("helpcmds" + section);
	var btn = document.getElementById("helptogglebtn" + section);	
	if ( sec.style.opacity == "1" ) {
		sec.style.opacity = "0" ;
		sec.style.visibility = "hidden" ;
		sec.style.maxHeight = "0px" ;
		btn.innerHTML = "+";
		if ( helpcmds.scrollTop > sec.offsetTop - 20)
			setTimeout(function(){helpcmds.scrollTop = sec.offsetTop - 20;}, 200);
	}
	else {
		sec.style.opacity = "1";
		sec.style.visibility = "visible" ;
		sec.style.maxHeight = sec.scrollHeight + "px" ;
		btn.innerHTML = "--";
	}		
}

// Main LALOLab help
HELPcontent["LALOLab"] = ["Welcome", "Welcome", "LALOLab:\n the Linear ALgebra Online Lab", "Look at the simple example below to get started or browse through the help topics on the right. ", "A = [ [1,2] ; [3,4] ; [5,6] ]  // define a matrix\nb = [3; -0.2; 5]  // define a (column) vector\nx = A \\ b // solve the linear system\nplot( A*x - b )  // plot the error"];

HELPcontent["LALOLib"] = ["Welcome", "Using LALOLib in web apps", "LALOLib:\n a library for linear algebra online", "All functions available in LALOLab are implemented in the stand-alone library LALOLib. This library should make it easy to develop scientific/numerical web applications.<br>LALOLab can be used to prototype/test a script and then translate it to javascript code based on LALOLib.<br>Alternatively, stand-alone HTML pages can be created from scripts. In this case, the output of computations can be displayed with the print() command. For instance, copy the example below to the multi-line input and click on the \"HTML code\" button. This generates HTML code that can be copied to a file (say test.html) to produce a stand-alone web page.<br><br>See also <a target='_blank' href='lalolib.html'>how to use LALOLib?</a> ", "A = rand(5,3)\nprint(\"A = \")\nprint(A)\nx = rand(3)\nprint(\"x = \")\nprint(x)\nprint(\"Ax = \")\nprint(A*x)\nplot(randn(30), \"b\", \"random values\")"];

// Operators
HELPcontent["[ ] (get,set)"] = ["Basics", "Matrix notations", "a = [a1; a2;...]\nA = [ [a11, a12]; [a21, a22] ]\n\nai = a[i] = get(a, i)\naij = A[i,j] = A[i][j]\naij = get(A, i, j)\n\nA[i,j] = x\nset(A, i, j, x)", "Square brackets are used to create a matrix/vector or access its entries with indexes starting at 0. Matrices are created (and stored) rowwise. See also 'mat' for matrix concatenation.<br>Ranges (with the notation ':') can be used to access multiple entries inside a " + htmlmatrix + " or " + htmlvector + ". Elements of a matrix can be indexed either with a comma between the rows and columns indexes or with two pairs of brackets."];
HELPcontent[": (range)"] = ["Basics", "Index ranges","idx = 0:n\nidx = range(n)\nidx = a:b\nidx = range(a,b)\nidx = a:inc:b\nidx = range(a,b,inc)\nrange()","Return a range of indexes as a vector of integers between a and b including a but not b. <br>The increment 'inc' defaults to 1 (or -1 if a > b). <br>In accessing matrix entries, [:] or range() can be used to extract a full row or column.", "A=rand(10,10)\nprint( A[0:2,0:3] ) // yields a 2x3 submatrix\nprint( A[:,5] ) // yields an entire column\ncountdown = 5:-1"];
HELPcontent["+ (add)"] = ["Basics", "Addition","C = A + B\nC = add(A,B)","A and B can be numbers, vectors or matrices."];
HELPcontent["- (sub)"] = ["Basics", "Substraction","C = A - B\nC = sub(A,B)","A and B can be numbers, vectors or matrices."];
HELPcontent["* (mul)"] = ["Basics", "Multiplication","C = A * B\nC = mul(A,B)","Generic number/vector/matrix multiplication. Let A and B be matrices,  a and b be (column) vectors and s a scalar. Then, <br><br>A*B and A*b are matrix multiplications, <br><br>a*b is a dot product equivalent to the matrix multiplication a'*b (a' is a single-row matrix and not a vector),<br><br>A*s, s*A, a*s, s*a are entry-wise scalar multiplications."];
HELPcontent[".* (entrywisemul)"] = ["Basics", "Entry-wise multiplication","C = A .* B\nC = entrywisemul(A,B)","A and B can be numbers, vectors or matrices but must be of the same size."];
HELPcontent["./ (entrywisediv)"] = ["Basics", "Entry-wise division","C = A ./ B\nC = entrywisediv(A,B)","A and B can be numbers, vectors or matrices but must be of the same size."];
HELPcontent["^ (pow)"] = ["Basics", "Power","C = A^B","Return A to the power B computed entrywise. Thus, if A is a matrix, A^2 is not A*A but A.*A. "];
HELPcontent["' (transpose)"] = ["Basics", "Matrix transpose","B = A'\nB = transpose(A)","Compute the transpose of A."];
HELPcontent["\\ (solve)"] = ["Basics","Solve a linear system of equations", "x = A \\ b\nx = solve( A, b )", "If A is square, solve Ax = b using Gaussian elimination. Otherwise, this computes the minimizer of ||Ax - b|| using QR factorization. ", "x = randn(10)\nA = randn(10,10)\nb = A*x + 0.01*randn(10)\nxhat = solve(A,b)\nerr = norm(x - xhat)"];

// Logical operators
HELPcontent["== (isEqual)"] = ["Basics", "Equality test","C = (A == B)\n","Return a vector/matrix C of same size as A with entries Cij=1 if Aij=Bij and 0 otherwise. B must have same size as A or be a number."];
HELPcontent["!= (isNotEqual)"] = ["Basics", "Not equal test","C = (A != B)\n","Return a vector/matrix C of same size as A with entries Cij=0 if Aij=Bij and 1 otherwise. B must have same size as A or be a number."];
HELPcontent["> (isGreater)"] = ["Basics", "Inequality test","C = (A > B)\n","Return a vector/matrix C of same size as A with entries Cij=1 if Aij>Bij and 0 otherwise. B must have same size as A or be a number."];
HELPcontent[">= (isGreaterOrEqual)"] = ["Basics", "Inequality test","C = (A >= B)\n","Return a vector/matrix C of same size as A with entries Cij=1 if Aij>=Bij and 0 otherwise. B must have same size as A or be a number."];
HELPcontent["< (isLower)"] = ["Basics", "Inequality test","C = (A < B)\n","Return a vector/matrix C of same size as A with entries Cij=1 if Aij<Bij and 0 otherwise. B must have same size as A or be a number."];
HELPcontent[">= (isLowerOrEqual)"] = ["Basics", "Inequality test","C = (A <= B)\n","Return a vector/matrix C of same size as A with entries Cij=1 if Aij<=Bij and 0 otherwise. B must have same size as A or be a number."];

// Matrix generation 
HELPcontent["size"] = ["Basics", "Size of a matrix/vector","s = size(A)\nm = size(A, 1)\nn = size(A, 2)","Return the size of a matrix/vector as a vector s = [m, n] or simply the number of rows m or of columns n.<br><br>Note that for a vector <i>a</i>, <i>a.length</i> yields its dimension, while the dimensions of a matrix <i>A</i> can be directly accessed as <i>A.m</i> and <i>A.n</i>."];
HELPcontent["type"] = ["Basics", "Type of an object","tx = type(x)","Return a string indicating the type of an object: \"number\", \"vector\", \"matrix\", \"spvector\", \"spmatrix\", \"string\", \"object\" or \"function\".<br><br>Complex types corresponding for instance to machine learning models or statistical distributions can also take the form of a general class followed by a subclass, e.g., \"Classifier:SVM\" or \"Distribution:Gaussian\"."];
HELPcontent["zeros"] = ["Basics", "Zero matrix/vector","v = zeros(n)\nA = zeros(m,n)","Generate an n-dimensional vector v or m-by-n matrix A filled with zeros."];
HELPcontent["ones"] = ["Basics", "Matrix/vector of 1","v = ones(n)\nA = ones(m,n)","Generate an n-dimensional vector v or an m-by-n matrix A filled with ones."];
HELPcontent["eye"] = ["Basics", "Identity matrix","I = eye(n)\n","Return the n-by-n identity matrix."];
HELPcontent["mat"] = ["Basics", "Matrix concatenation","C = [A, B, ...]\n<span style='font-weight:normal;'>{ C = mat([A, B, ...]) } </span>\nC = [A; B; ...]\n<span style='font-weight:normal;'>{ C = mat([A, B, ...], true) } </span>\nv = mat( array )\nM = mat( array2D )","Concatenate matrices and vectors column-wise if separated with commas or row-wise if separated with semicolons (or if calling mat() with the second set to true). In the row-wise case, vectors are automatically transposed.<br>If array is a javascript Array of numbers, mat( array ) returns a column vector with the same entries. If array2D is a javascript Array of Arrays, mat( array2D ) returns a matrix M with M[i,j] = array2D[i][j].","x1 = [1,2,3]\nx2 = [4,5,6]\nX = [x1; x2]"];
HELPcontent["diag"] = ["Basics", "Matrix diagonal","d = diag( A )\nD = diag( v )","Return the diagonal d of a matrix A or a diagonal matrix D with entries from a vector v."];
HELPcontent["triu"] = ["Basics", "Upper triangular part","U = triu( A )","Extract the upper triangular part of a matrix."];
HELPcontent["tril"] = ["Basics", "Lower triangular part","L = tril( A )","Extract the lower triangular part of a matrix."];
HELPcontent["xtx"] = ["Basics", "Faster X'X","xtx(X)\n","Compute X'*X a bit faster than X'*X. "];
HELPcontent["vec"] =  ["Basics", "Matrix vectorization","v = vec( A )","Return a vector v containing all entries of a matrix A read row-wise, such that v[i*A.n + j] = A[i,j].<br>Note: vec(A) returns a copy of the entries of A, whereas A.val is a reference to its vector of entries. "];
HELPcontent["reshape"] =  ["Basics", "Reshape dimensions","B = reshape( A, m, n )","Return a reshaped matrix (for n > 1) or vector (for n = 1) with m rows and n columns by reading the entries of A rowwise and storing them in B rowwise. ", ["a = 0:12 // a is a vector\nA = reshape(a, 3, 4) // returns a matrix", "a = 0:12\nA = reshape(a, 3,4)\nB = reshape(A, 6, 2)"] ];
HELPcontent["swaprows"] =  ["Basics", "Swap rows of a matrix","swaprows( A, i, j )","Swap rows i and j in the matrix A."];
HELPcontent["swapcols"] =  ["Basics", "Swap columns of a matrix","swapcols( A, i, j )","Swap columns i and j in the matrix A."];
HELPcontent["supp"] = ["Basics", "Support of a vector","indexes = supp( x )","Return a list of indexes corresponding to the support of x."];

// Sparse
HELPcontent["sparse"] = ["Basics", "Sparse matrix/vector","A = sparse( X )\nA = sparse( X, rowmajor )\nb = sparse( x )","Return a sparse matrix or vector of \"spmatrix\" or \"spvector\" type such that full( sparse( X ) ) = X. By default sparse matrices are stored in row major (or row compressed) format, use sparse ( X, false ) for column major format.  "];
HELPcontent["full"] = ["Basics", "Full matrix/vector","X = full( A )\nx = full( b )","Return a full matrix or vector of \"matrix\" or \"vector\" type such that sparse( full( A ) ) = A. "];
HELPcontent["speye"] = ["Basics", "Sparse identity matrix","A = speye( n )","Return the identify matrix of size n by n in sparse format ( \"spmatrix\" ). "];
HELPcontent["spdiag"] = ["Basics", "Sparse diagonal matrix","A = spdiag( a )","Return a sparse diagonal matrix with diagonal entries taken from the vector a. "];


// Who / Delete
HELPcontent["who"] = ["Basics", "List of variables","who()","Prints the list of variables in the workspace."];
HELPcontent["delete"] = ["Basics", "Delete a variable","delete(x)","Deletes the variable x from the workspace."];

// Find 
HELPcontent["find"] = ["Basics", "Find indexes","find( b )","Return a list of indexes (as a vector of integers) corresponding to the nonzero entries in b. If b is a boolean expression, then this yields the indexes for which the expression is true.", "x = randn(10)\nidx = find( x > 0 )"];
HELPcontent["min"] = ["Basics", "Minimum","min(X, d)","Return the minimum among all entries in X (without d) or a vector of minima among its columns (if d=1) or rows (if d=2)."];
HELPcontent["max"] = ["Basics", "Maximum","max(X, d)","Return the maximum among all entries in X (without d) or a vector of maxima among its columns (if d=1) or rows (if d=2)."];
HELPcontent["findmin/argmin"] = ["Basics", "Index of the minimum", "findmin(x)\nargmin(x)","Return the (smallest) index of the minimum in a vector."];
HELPcontent["findmax/argmax"] = ["Basics", "Index of the maximum", "findmax(x)\nargmax(x)","Return the (smallest) index of the maximum in a vector."];
HELPcontent["sort"] = ["Basics", "Sort a vector", "sort(x)\nsort(x,dec)\nsort(x,dec,returnIdx)","sort(x) returns a vector with values of x in increasing (or decreasing if dec is true) order.<br> If the third argument is true, sort returns the sorted list of indexes and stores the sorted x in place of the original one."];



// Norms & reductions
HELPcontent["sum"] = ["Basics", "Summation","sum(X)\nsum(X,d)","Sum all entries in X or only along the dimension d to produce a vector. ", "X = [[1,2];[3,4]]\nsum(X,2) // sum the rows and return a vector"];
HELPcontent["prod"] = ["Basics", "Product","prod(X)\nprod(X,d)","Compute the product of all entries in X or only along the dimension d to produce a vector. ", "X = [[1,2];[3,4]]\nprod(X,2) // vector of product of rows"];
HELPcontent["trace"] = ["Basics", "Trace of a matrix","trace( A )","Compute the trace of the square matrix A as the sum of its diagonal entries."];
HELPcontent["det"] = ["Basics", "Determinant of a matrix","det( A )","Compute the determinant of the square matrix A."];
HELPcontent["norm"] = ["Basics", "Euclidean/Frobenius norm","norm(X)\nnorm(X,d)\nnorm(x)","Compute the Frobenius norm of the matrix X or the Euclidean norms of its columns/rows.<br> If x is a vector, norm(x) is its Euclidean norm."];
HELPcontent["norm1"] = ["Basics", "l1-norm","norm1(X)\nnorm1(X,d)\nnorm1(x)","Compute the l1-norm of a matrix, of its columns (if d=1), of its rows (if d=2), or of a vector. "];
HELPcontent["norminf"] = ["Basics", "l_inf/max-norm","norminf(X)\nnorminf(X,d)\nnorminf(x)","Compute the max-norm of a matrix, of its columns (if d=1), of its rows (if d=2), or the l_inf-norm of a vector (the maximal absolute value). "];
HELPcontent["norm0"] = ["Basics", "l0-pseudo-norm","norm0(X)\nnorm0(X,d)\nnorm0(x)","Compute the l0-pseudo-norm of (i.e., the number of nonzero entries in) a matrix, of its columns (if d=1), of its rows (if d=2), or of a vector. "];
HELPcontent["normp"] = ["Basics", "lp-norm","normp(X, p)\nnormp(X, p, d)\nnormp(x, p)","Compute the lp-norm of a matrix, of its columns (if d=1), of its rows (if d=2), or the lp-norm of a vector. "];
HELPcontent["normnuc"] = ["Basics", "Nuclear norm","normnuc(X)","Compute the nuclear norm of a matrix as the sum of its singular values. "];

// Linear systems
HELPcontent["solve"] = ["Basics","Solve a linear system of equations", "x = solve( A, b )", "Solve the linear system Ax = b by QR factorization with column pivoting.<br> If A has more rows than columns, this yields the least squares solution minimizing ||Ax - b||. If the system is underdetermined, this yields a basic solution with no more than rank(A) nonzeros.", "x = randn(10)\nA = randn(10,10)\nb = A*x + 0.01*randn(10)\nxhat = solve(A,b)\nerr = norm(x - xhat)"];
HELPcontent["solvecg"] = ["Basics","Conjugate gradient method", "x = solvecg( A, b )", "Solve the linear system Ax = b with symmetric and positive definite A by the conjugate gradient method. <br> Use cgnr(A,b) to solve overdetermined least squares problems. ", "x = randn(10)\nA = randn(10,10)\nb = A'*A*x + 0.01*randn(10)\nxhat = solvecg(A'*A,b)\nerr = norm(x - xhat)"];
HELPcontent["cgnr"] = ["Basics","Conjugate gradient normal equation residual method", "x = cgnr( A, b )", "Solve the least square problem, min ||Ax - b||, with A.m > A.n by the conjugate gradient normal equation residual method. ", "x = randn(1000)\nA = randn(10000,1000)\nb = A*x + 0.01*randn(10000)\nxhat = cgnr(A,b)\nerr = norm(x - xhat)"];
HELPcontent["inv"] = ["Basics","Matrix inverse", "inv( A )", "Compute the matrix inverse of A or return \"singular\".", "A = [ [1, -2], [-2, 1] ]\nAinv = inv(A)\nI = A * Ainv"];
HELPcontent["eig"] = ["Basics","Eigenvalue decomposition", "v = eig( A )\nE = eig( A, true )", "eig( A ) computes the eigenvalues of A. <br>eig( A, true ) returns both the eigenvalues (in E.V) and the eigenvectors (in E.U) in the eigendecomposition A = E.U * diag(E.V) * E.U'.<br>NOTE: only implemented for symmetric A.", "//Symmetric eigenvalue decomposition\nX = rand(30,30)\nA = X*X'\nE = eig(A, true)\nnorm(E.U * diag(E.V) * E.U' - A)"];
HELPcontent["eigs"] = ["Basics","Few eigenvalues and eigenvectors", "eigs( A )\neigs( A , k)\neigs( A , k , \"smallest\")", "eigs( A ) computes the eigenvalue with largest magnitude and the corresponding eigenvector of A using the power method. <br>eigs( A, k ) computes the k such eigenvalue-eigenvector pairs with orthogonal iterations.<br>eigs( A , k , \"smallest\") computes the k eigenpairs with eigenvalues closest to 0 by inverse orthogonal iterations. If the eigenvalues of A are positive, this yields the smallest eigenvalues."];

// Factorizations
HELPcontent["rank"] = ["Basics", "rank","rank(X)","Compute the numerical rank of X by thresholding singular values below 1e-10. ", "X = rand(6,3)\nr = rank(X*X')  // should return 3 "];
HELPcontent["chol"] = ["Basics", "Cholesky factorization","G = chol(X)","Return the lower triangular matrix G in the Cholesky factorization X = G*G' of a symmetric and positive definite X.<br> If X is not positive-definite, chol(X) is undefined, which evaluates to false in tests.", ["R = rand(3,3)\nX = R'*R\nG = chol(X)\ne = norm(G*G' - X)", "X = rand(5,5)\nif ( ! chol(X) ) { \n \"X is not positive definite\"\n}\n"] ];
HELPcontent["cholsolve"] = ["Basics", "Positive definite linear system","x = cholsolve(L,b)","Solve the square linear system Ax = b with a positive definite matrix A given its lower triangular Cholesky factor L such that LL' = A." ];
HELPcontent["qr"] = ["Basics", "QR factorization","QR = qr(X, computeQ)","Compute the QR factorization with column pivoting XP = QR. The result is an object in which QR.Q is the orthonormal Q (if computeQ is true), QR.R is the upper triangular R, QR.rank is an estimate of rank(X), QR.piv is a list of permutations indexes defining the permutation matrix P and QR.V and QR.beta are lists of householder vectors and constants used to represent Q in factored form when computeQ is false."];
HELPcontent["svd"] = ["Basics", "Singular value decomposition","svd(X)\nsvd(X,\"full\") = svd(X,true)\nsvd(X,\"thin\")\nsvd(X,\"U\")\nsvd(X,\"thinU\")\nsvd(X,\"V\")","svd(X) computes the singular values of an m-by-n X. With a second argument, (parts of) the full or thin singular value decomposition X = USV' is computed. For instance, svd(X, \"thinU\") only computes U and S in the thin SVD of X.", "X = rand(6,3)\nsvdX = svd(X, \"full\")\nsingularvalues = svdX.s\nnorm(X - svdX.U * svdX.S * svdX.V')"];
HELPcontent["nullspace"] = ["Basics", "Null space","nullspace(X)","Compute an orthonormal basis for the null space (kernel) of X."];
HELPcontent["orth"] = ["Basics", "Range of a matrix","orth(X)","Compute an orthonormal basis for the range of X."];

// Basic math functions
HELPcontent["apply"] = ["Basics", "Apply a function entrywise","Y = apply(f, X)","Return a matrix/vector Y of the same size as X with entries Y[i,j] = f( X[i,j] ). "];
HELPcontent["math functions"] = ["Basics", "Basic math functions","Y = f( X )","Return a matrix/vector Y of the same size as X with entries Y[i,j] = f( X[i,j] ) where f is any of the following basic math functions:<br>abs, acos, asin, atan, atan2, ceil, cos, exp, floor, log, round, sign, sin, sqrt, log10, log2, cosh, sinh, tanh, acosh, asinh, atanh."];



// Plots
HELPcontent["plot"] = ["Plots", "Plot","plot(y)\nplot(x,y)\nplot(X)\nplot(..,\"style\",\"legend\")\nplot(..,\"style\",..,\"style\")","plot(x,y) plots the set of points of coordinates (x[i],y[i]).<br>plot(y) uses x=0:y.length.<br>plot(X) is equivalent to plot(X[:,0], X[:,1]) if X has two columns and otherwise plots one curve for each row in X.<br>Multiple curves can be plotted by appending the corresponding arguments.<br>The style string can include a color and a dot (for scatter plot without line) or an underscore (for lines without dots). ", "x = -3:0.1:3\nplot(x,sin(PI*x),\"g\",\"sin(x)\",x,sin(PI*x)./(PI*x),\".r\",\"sinc(x) samples\")"];
HELPcontent["colorplot"] = ["Plots", "Color plot","colorplot(x,y,z)\ncolorplot(X,y)\ncolorplot(X)","colorplot(x,y,z) plots the set of points of 2D coordinates (x[i],y[i]) with color z[i].<br>colorplot(X,y) is equivalent to colorplot(X[:,0], X[:,1], y) and colorplot(X) is equivalent to colorplot(X[:,0], X[:,1], X[:,2]).", "colorplot(rand(50,3))" ];
HELPcontent["plot3"] = ["Plots", "3D plot","plot3(x,y,z)\nplot3(X)\nplot3(X1,\"style\",\"legend\",X2,\"style\",\"legend\",...)","plo3t(x,y,z) plots the set of points of coordinates (x[i],y[i],z[i]).<br>plot3(X) is equivalent to plot3(X[:,0], X[:,1], X[:,2]).<br>Multiple curves can be plotted by appending the corresponding arguments.<br>The style string can include a color and an underscore (for lines without dots). ", "x=12*rand(100)-6\ny=12*rand(100)-6\nz = 5*sin(x) + y\nplot3(x,y,z)"];
HELPcontent["image"] = ["Plots", "Image view of a matrix","image(X)\nimage(X, title)","Plot the matrix X as an image, i.e., as a colormap of its entries.", "X = rand(20,20)\nimage(X,\"A random image\")"];

// Programming (javascript standards)
HELPcontent["for"] = ["Programming", "FOR loop","for ( init ; cond ; inc) {\n" + htmltab + "...\n}","Standard FOR loop following the Javascript notation.","x=zeros(10)\nfor ( i=1; i < 10; i++) {\n   x[i] = x[i-1] + 1\n}"];
HELPcontent["while"] = ["Programming", "WHILE loop","while ( condition ) {\n" + htmltab + "...\n}","Standard WHILE loop following the Javascript notation."];
HELPcontent["do - while"] = ["Programming", "DO - WHILE loop","do {\n" + htmltab + "...\n} while( condition );","Standard DO-WHILE loop following the Javascript notation."];
HELPcontent["function"] = ["Programming", "Functions","function f(x) {\n" + htmltab + "var y\n"+ htmltab + "...\n" + htmltab + "return y\n} ","Create a function named f of argument x and which returns y. <br>Local variables must be declared with \"var\", otherwise they will be treated as global variables.<br>The return statement should not include operations outside of brackets: 'return 2*x' yields an error, but 'return (2*x)' is correct.", "function f( x ) {\n   return (norm(x)^2) \n}\nf( [ 1, 1 ] ) // should be 2"];
//HELPcontent["importScripts"] = ["Programming", "Import javascript code","importScripts(\"module.js\")", "Import a javascript module, giving access to all its global variables and functions."];
HELPcontent["tic / toc"] = ["Programming", "Timing functions","tic()\n...\nelapsedTime = toc()", "tic() and toc() can be used to time a function or script. toc() returns the elpased time (in seconds) since the last call to tic().","tic()\nrandn(10000,100)*rand(100)\nelapsedTime = toc()"];
HELPcontent["error"] = ["Programming", "Error message","error(\"error message\")\n", "Throw an Error with the corresponding message, interrupting the execution. "];

HELPcontent["javascript"] = ["Programming", "Plain Javascript","{ javascript code; }", "Plain javascript can be embedded in scripts by surrounding javascript lines with braces. The javascript lines must include a semi-colon.<br><br>See the <a href='lalolib.html#datatypes'>implementation details</a> on data types to know how to use these directly.", "a = ones(5)\na[1] = a[1] + 1  // LALOLab code\n{ a[2] += 2 ; } // javascript code \n"];

// Statistics
HELPcontent["mean"] = ["Statistics", "Mean","mean(X)\nmean(X,d)","Compute the mean of all entries in X or only along the dimension d to produce a vector. ", "X = [[1,2];[3,4]]\nmean(X,2) // return the means of each row in a vector"];
HELPcontent["variance"] = ["Statistics", "Variance","variance(X)\nvariance(X,d)","Compute the variance of all entries in X or only along the dimension d to produce a vector. ", "X = randn(100,2)\nvariance(X,1) // return the variance of each column in a vector"];
HELPcontent["std"] = ["Statistics", "Standard deviation","std(X)\nstd(X,d)","Compute the standard deviation of all entries in X or only along the dimension d to produce a vector. ", "X = randn(100,2)\nstd(X,1) // return the std of each column in a vector"];
HELPcontent["cov"] = ["Statistics", "Covariance matrix","C = cov(X)\n","Compute the covariance matrix C of the columns of X. ", "X = randn(100,3)\nC = cov(X)"];
HELPcontent["rand"] = ["Statistics", "Uniformly random matrix/vector","v = rand(n)\nA = rand(m,n)","Generate a random n-dimensional vector v or m-by-n matrix A with uniformly distributed entries in [0,1]."];
HELPcontent["randn"] = ["Statistics", "Gaussian matrix/vector","v = randn(n)\nA = randn(m,n)","Generate a random n-dimensional vector v or m-by-n matrix A with normally distributed entries (mean=0, std=1)."];
HELPcontent["randsparse"] = ["Statistics", "Uniformly random sparse matrix/vector","v = randsparse(s,n)\nA = randsparse(s,m,n)","Generate a sparse n-dimensional vector v or m-by-n matrix A with s (or s*m*n if s < 1) uniformly distributed entries in [0,1]. <br>NOTE: randsparse() returns a full matrix with zeros, use sparse(randsparse(...)) to obtain a sparse matrix of \"spmatrix\" type."];
HELPcontent["randnsparse"] = ["Statistics", "Sparse Gaussian matrix/vector","v = randnsparse(n)\nA = randnsparse(m,n)","Generate a sparse n-dimensional vector v or m-by-n matrix A with s (or s*m*n if s < 1) normally distributed entries (mean=0, std=1). <br>NOTE: randnsparse() returns a full matrix with zeros, use sparse(randnsparse(...)) to obtain a sparse matrix of \"spmatrix\" type."];
HELPcontent["randperm"] = ["Statistics", "Random permutation","p = randperm( x )\np = randperm ( N )","Return a random permutation of a vector x or of the index list 0:N."];
HELPcontent["mvnrnd"] = ["Statistics", "Multivariate normal random numbers","X = mvnrnd(mu, Sigma, N)\n","Generate N random vectors as rows in X according to a multivariate normal distribution of mean mu and covariance matrix Sigma. A lower triangular matrix L such that Sigma = L*L' can be provided instead of Sigma to avoid computing the cholseky factorization of sigma at every call of mvnrnd.", "Sigma = [[1, 0.7]; [0.7,3]]\nX = mvnrnd([1,2],Sigma, 500)\nplot(X,\".\")\ncov(X)  // should be close to Sigma"];
HELPcontent["nchoosek"] = ["Statistics", "Binomial coefficient","nchoosek(n, k)","Return the number of combinations of k items taken among n, i.e., n!/k!(n-k)! ."];

HELPcontent["<strong>Distribution</strong>"] = ["Statistics", "Distributions","P = new Distribution( name, arg1, arg2)\nx = P.sample()\nX = P.sample(N)\np = P.pdf(x)\nP.estimate(X)\nP.info()\nP.mean\nP.variance\nP.std","Create a new distribution. 'name' can be Uniform, Gaussian, Bernoulli. arg1 and arg2 depend on the name as detailed in the corresponding help sections.<br>Any distribution has fields P.mean, P.variance and P.std. <br>Any distribution can be estimated from a set of points stored as rows in X with P.estimate(X) or sampled with P.sample(N). Values of the probability density (or mass) function can be retrieved with P.pdf(x). "]; 
HELPcontent["Uniform"] = ["Statistics", "Uniform distribution","P = new Distribution( Uniform, N)\nP = new Distribution( Uniform, [x1,x2...])\nP = new Distribution( Uniform, a, b)","Create a uniform distribution over the N first integers, the integers [x1, x2...], or the reals within the interval [a,b] (where a and b can be numbers or vectors). ", ["// Roll of a die\nD = new Distribution(Uniform, 1:7)\nplot(D.sample(10),\".\",\"sample of die values\" )\nD.info()", "// Continuous distribution\nU = new Distribution(Uniform, -1, 1)\nX = U.sample(50)\nUhat = new Distribution(Uniform)\nUhat.estimate(X)\nr=-2:0.1:2\nplot(X,zeros(50),\".\",\"samples\",r,U.pdf(r),\"g_\",\"pdf\",r,Uhat.pdf(r),\"r_\",\"estimated pdf\")\nUhat.info()" ] ]; 
HELPcontent["Gaussian"] = ["Statistics", "Gaussian distribution","P = new Distribution( Gaussian, mean, variance)\n","Create a Gaussian distribution. By default, mean = variance = 1. If mean is a vector, the distribution is a multivariate Gaussian with independent components and variance should be a vector of same length. ", ["P = new Distribution (Gaussian, 0, 3)\nX = P.sample(50)\nPhat = new Distribution(Gaussian)\nPhat.estimate(X)\nr = -5:0.2:5\nplot(X, zeros(50), \".\", \"samples\",r, P.pdf(r),\"g_\",\"pdf\",r,Phat.pdf(r),\"r_\",\"estimated pdf\")", "// multivariate Gaussian with independent components\nP = new Distribution (Gaussian, [0;1], [1;4])\nX = P.sample(100)\nplot(X,\".\",\"samples\")\np = P.pdf(X)\nplot3([X,50*p]) // plot pdf"]]; 
HELPcontent["mvGaussian"] = ["Statistics", "Multivariate Gaussian distribution","P = new Distribution( mvGaussian, mu, Sigma)\n","Create a multivariate Gaussian distribution of mean mu and covariance matrix Sigma. ", "mu = [1;2]\nSigma = [[1, 0.7]; [0.7,3]]\nP = new Distribution (mvGaussian, mu, Sigma)\nX = P.sample(100)\nplot3([X, 50*P.pdf(X)])"]; 
HELPcontent["Bernoulli"] = ["Statistics", "Bernoulli distribution","P = new Distribution( Bernoulli, p)\n","Create a Bernoulli distribution with parameter p which defaults to 0.5. If p is a vector, then P is a multi-dimensional distribution with independent Bernoulli components. ", "P = new Distribution (Bernoulli, 0.3)\nX = P.sample(50)\nPhat = new Distribution(Bernoulli)\nPhat.estimate(X)\nPhat.info()"]; 
HELPcontent["Poisson"] = ["Statistics", "Poisson distribution","P = new Distribution( Poisson, lambda)\n","Create a Poisson distribution with integer parameter lambda which defaults to 5. If lambda is a vector, then P is a multi-dimensional distribution with independent Poisson components. ", "P = new Distribution (Poisson, 4)\nX = P.sample(50)\nPhat = new Distribution(Poisson)\nPhat.estimate(X)\nPhat.info()\nr=1:20\nplot(X,zeros(50),\".\",\"samples\",r,P.pmf(r),\"g.\",\"pmf\",r,Phat.pmf(r),\"r.\",\"estimated pmf\")\n"]; 


// Optimization
HELPcontent["lp"] = ["Optimization", "Linear programming","x = lp(c, A, b, Aeq, beq, lb, ub, integers)\nx = linprog(...)","Solve the linear program \\begin{align}\\min_{lb\\leq x\\leq ub}\\ &c^T x ,\\\\ s.t.\\ & Ax\\leq b,\\\\ & A_{eq} x = b_{eq}, \\\\ & x_{integers} \\in \\mathbb{Z} .\\end{align}", "A = [[3,2,1,1,0];[2,5,3,0,1]]\nb = [10;15]\nc = [-2;-3;-4;0;0]\nlb = zeros(5)\nxsol = lp(c, [],[],A, b,lb,[])\n// solution should be [0;0;5;5;0]"];
HELPcontent["qp"] = ["Optimization", "Quadratic programming","x = qp(Q, c, A, b, Aeq, beq, lb, ub)\nx = quadprog(...)","Solve the convex quadratic program \\begin{align}\\min_{lb\\leq x\\leq ub}\\ &\\frac{1}{2} x^T Qx + c^T x ,\\\\ s.t.\\ & Ax\\leq b,\\\\ & A_{eq} x = b_{eq}\\end{align} with the Frank-Wolfe algorithm.", "Q=[ [4, 1]; [1,2] ]\nc = [1;1]\nlb=[0;0]\nAeq=[1;1]'\nbeq=1\nx = qp(Q,c,[],[],Aeq,beq,lb) \n// solution should be [0.25; 0.75]"]; 
HELPcontent["minl1"] = ["Optimization", "l1-minimization","x = minl1( A, b )", "Compute the minimum l1-norm solution to the linear system Ax = b, i.e., solve $$\\min_{x} \\|x\\|_1 ,\\ s.t.\\ Ax=b$$", "//Basis pursuit sparse recovery\nA = randn(10,20)\nx = zeros(20)\nx[0:3] = randn(3)\nxhat = minl1(A,A*x)"];
HELPcontent["minl0"] = ["Optimization", "Bounded l0-minimization","x = minl0( A, b, M )", "Compute the sparsest solution within [-M,M]^n to the linear system Ax = b, i.e., solve $$\\min_{-M\\leq x\\leq M} \\|x\\|_0 ,\\ s.t.\\ Ax=b,$$ via the mixed-integer linear program \\begin{align}\\min_{x, \\beta} & \\beta^T 1 \\\\ s.t.\\ & Ax=b,\\\\ &  -M \\beta\\leq x \\leq M\\beta,\\\\& \\beta\\in\\{0,1\\}^n\\end{align}", "//Exact sparse recovery\nA = randn(10,20)\nx = zeros(20)\nx[0:3] = randn(3)\nxhat = minl0(A,A*x)"];
HELPcontent["minimize"] = ["Optimization", "Unconstrained minimization","x = minimize( f, grad )\nx = minimize( f, grad, n )\nx = minimize( f, grad, x0 )", "Compute the (local) minimizer of the objective function f(x) of gradient grad(x) using BFGS with polynomial line search (or the secant method if n=1 or steepest descent if n>500).<br>f and grad must be functions returning the objective value and the gradient vector, respectively. <br>n is the dimension of x (1 by default).<br> x0 is the initial point (random by default). Note that x0 cannot be a positive integer for one-dimensional problems. ", "function f(x) {\n  return (2*sum(x) + x'*x)\n}\nfunction grad(x) {\n  return (2 + 2*x)\n}\nx = minimize(f, grad, 5) // should be [-1;-1;-1;-1;-1]"];

// Machine Learning 
 
HELPcontent["<strong>Classifier</strong>"] = ["MachineLearning", "Classifiers","C = new Classifier(algo)\nC = new Classifier(algo, params)\nC.train(X, Y)\ntrain(C, X, Y)\nC.update(X, Y)\nlabels = C.predict(X)\nrecRate = C.test(Xt,yt)\nrecRate = C.cv(X,y, nFolds)\nstats = C.tune(X, Y)\nC.info()","Create a new classifier of a given type (algorithm) with given parameters (params). Any classifier can be trained (with C.train), used to make predictions (C.predict), tested (with C.test), cross-validated (with C.cv) or tuned on a particular data set (C.tune). Some classifiers can also be updated online with additional data (with C.update). <br> X is a " + htmlmatrix + " or " + htmlvector + " representing a data set labeled by the vector Y. The labels can be any numbers.<br><i>algo</i> can be KNN, LDA, NaiveBayes, LogReg, Perceptron, MLP, SVM, MSVM or DecisionTree (see the corresponding help topics).<br><i>params</i> is an object of key/value pairs depending on the algorithm. Use C.info() to see the list of default parameters and available functions for a given algorithm.<br> The function C.tune() tries to automatically find the optimal parameters with respect to a cross-validation estimate with C.tune(X,Y) or a validation set with C.tune(X,Y,Xvalid,Yvalid). <br><br>Binary algorithms such as Perceptron or SVM use the one-vs-all decomposition method to deal with multi-class data sets, unless the <i>onevsone</i> parameter is set to true.", , "classification.html"];

HELPcontent["KNN"] = ["MachineLearning", "K-nearest neighbors","knn = new Classifier(KNN, K)\nknn.train(X, Y)\nknn.update(X, Y)\nknn.tune(X, Y)\nknn.predict( x )","Create a new K-nearest neighbors classifier with K neighbors and train it with knn.train(X,Y) on a data set X labeled with Y. If not provided, K defaults to 3.  After an initial training with train(X,Y), the classifier can be updated online with new data by update(Xnew, Ynew). <br>The function C.tune(X,Y) automatically sets K in [1,15] to the best value on the basis of a leave-one-out estimate with a fast implementation requiring about the same time as a simple test on the training data. C.tune(X,Y,Xvalid,Yvalid) works similarly but with a validation error estimated on (Xvalid,Yvalid).", ["X1 = 5 + randn(10,2)\nX2 = -3 + randn(10,2)\nX3 = 0.5*randn(8,2)\nX = [X1;X2;X3]\nY = zeros(28)\nY[0:10] = 1\nY[10:20] = 2\nY[20:28] = 3\nknn = new Classifier(KNN)\nknn.train(X,Y)\nplot(X1,\".b\", \"Points of class 1\", X2, \".g\", \"Points of class 1\", X3, \".r\", \"Points of class 3\")\nx = -10+20*rand(2000,2)\ncolorplot(x, knn.predict(x), \"KNN predictions\")\nknn.info()","// Handwritten digit recognition\n// with automatic tuning of K\ndata = loadURL(\"examples/usps.train\")\nX = data[:,0:256]\nY = data[:,256]\ndata = loadURL(\"examples/usps.test\")\nXt = data[:,0:256]\nYt = data[:,256]\nknn = new Classifier(KNN)\nstats = knn.tune(X, Y)\nrecRate = knn.test(Xt, Yt)"], "knn.html"];

HELPcontent["LDA"] = ["MachineLearning", "Linear discriminant analysis","c = new Classifier(LDA)\nc.train(X, Y)\nc.predict( x )","Create a new linear discriminant and train it on a data set X labeled with Y.", "X1 = 5 + randn(10,2)\nX2 = -3 + randn(10,2)\nX = [X1;X2]\nY = zeros(20)\nY[0:10] = 1\nY[10:20] = 2\nc = new Classifier(LDA)\nc.train(X,Y)\nxh=-10:10\nplot(X1,\"b.\",\"Points from class 1\",X2,\"r.\",\"Points from class 2\",xh,-(c.b+c.w[0]*xh)./c.w[1],\"_k\",\"separating hyperplane\")\nc.info()", "lda.html"];

HELPcontent["NaiveBayes"] = ["MachineLearning", "Naive Bayes classifier","nb = new Classifier(NaiveBayes, {distribution: D})\nnb.train(X, Y)\nnb.update(X, Y)\nnb.predict( x )","Create a new naive Bayes classifier assuming class-conditional component-wise distributions of the family D, where D can be any of the univariate distrubtions listed in the Statistics help section and is Gaussian by default. After an initial training with train(X,Y), the classifier can be updated online with new data by update(Xnew, Ynew). ", "X1 = 5 + randn(10,2)\nX2 = -3 + randn(10,2)\nX3 = 0.5*randn(8,2)\nX = [X1;X2;X3]\nY = zeros(28)\nY[0:10] = 1\nY[10:20] = 2\nY[20:28] = 3\nnb = new Classifier(NaiveBayes, {distribution: Gaussian})\nnb.train(X,Y)\nplot(X1,\".b\", \"Points of class 1\", X2, \".g\", \"Points of class 1\", X3, \".r\", \"Points of class 3\")\nx = -10+20*rand(2000,2)\ncolorplot(x, nb.predict(x), \"Naive Bayes classifier predictions\")\nnb.info()", "naivebayesclassifier.html"];

HELPcontent["LogReg"] = ["MachineLearning", "Logistic regression","c = new Classifier(LogReg)\nc.train(X, Y)\nc.predict( x )","Create a new logistic regression classifier and train it on a data set X labeled with Y.", ["// Binary example\nX1 = 5 + randn(10,2)\nX2 = -3 + randn(10,2)\nX = [X1;X2]\nY = zeros(20)\nY[0:10] = 1\nY[10:20] = 2\nc = new Classifier(LogReg)\nc.train(X,Y)\nxh=-10:10\nplot(X1,\"b.\",\"Points from class 1\",X2,\"r.\",\"Points from class 2\",xh,-(c.b+c.w[0]*xh)./c.w[1],\"_k\",\"separating hyperplane\")\nc.info()", "// Multi-class example\nX1 = 5 + randn(150,2)\nX2 = randn(150,2)\nX3 = -5 + randn(150,2)\nX = [X1;X2;X3]\nY = zeros(450)\nY[0:150] = 1\nY[150:300] = 2\nY[300:450] = 3\nc = new Classifier(LogReg)\nc.train(X,Y)\nxh=-10:10\nplot(X1,\"b.\",\"Points from class 1\",X2,\"r.\",\"Points from class 2\", X3,\"g.\",\"Points from class 3\", xh,-(c.b[1]-c.b[0]+(c.w[1,0]-c.w[0,0])*xh)./(c.w[1,1]-c.w[0,1]),\"_m\",\"Sep. hyperplane for classes 1 and 2\", xh,-(c.b[0]+c.w[0,0]*xh)./c.w[0,1],\"_b\",\"Sep. hyperplane for classes 1 and 3\", xh,-(c.b[1]+c.w[1,0]*xh)./c.w[1,1],\"_r\",\"Sep. hyperplane for classes 2 and 3\")\nc.info()"], "logisticregression.html"];

HELPcontent["Perceptron"] = ["MachineLearning", "Perceptron","c = new Classifier(Perceptron)\nc = new Classifier(Perceptron, params)\nc.train(X, Y)\nc.predict( x )","Create a new perceptron and train it on a data set X labeled with Y.<br>params should be (a subset of):<br>{<br>Nepochs: max number of epochs,<br>learningRate: value in (0,1)<br>}", "X1 = 5 + randn(10,2)\nX2 = -3 + randn(10,2)\nX = [X1;X2]\nY = zeros(20)\nY[0:10] = 1\nY[10:20] = 2\nc = new Classifier(Perceptron)\nc.train(X,Y)\nxh=-10:10\nplot(X1,\"b.\",\"Points from class 1\",X2,\"r.\",\"Points from class 2\",xh,-(c.b+c.w[0]*xh)./c.w[1],\"_k\",\"separating hyperplane\")\nc.info()", "perceptron.html"];

HELPcontent["MLP"] = ["MachineLearning", "Multi-layer perceptron","c = new Classifier(MLP)\nc = new Classifier(MLP, params)\nc.train(X, Y)\nc.predict( x )","Create a new Multi-Layer Perceptron and train it on a data set X labeled with Y.<br>params should be (a subset of):<br>{<br>hidden: number of hidden neurons,<br>loss: \"crossentropy\" or \"squared\" (default),<br>epochs: max number of epochs (default is 1000),<br>learningRate: value in (0,1),<br>initialweightsvalue: bound for uniform inital weights<br>}", "X1 = 5 + randn(10,2)\nX2 = -3 + randn(10,2)\nX = [X1;X2]\nY = zeros(20)\nY[0:10] = 1\nY[10:20] = 2\nc = new Classifier(MLP)\nc.train(X,Y)\nplot(X[find(c.predict(X)==1),:],\"b.\",\"Points classified with label 1\",X[find(c.predict(X)==2),:],\"r.\",\"Points classified with label 2\")\nc.info()", "mlp.html"];

HELPcontent["SVM"] = ["MachineLearning", "Support Vector Machine","svm = new Classifier(SVM, params)\nsvm.train(X, Y)\nlabels = svm.predict( x )","Create a new SVM and train it on a data set X labeled with Y.<br>params should be (a subset of):<br>{<br>kernel: type of kernel function (see help on kernel),<br>kernelpar: value of kernel parameter,<br>C: value of the regularization constant<br>}", ["// Simpe 2D example\nX1 = 5 + randn(10,2)\nX2 = -3 + randn(10,2)\nX = [X1;X2]\nY = zeros(20)\nY[0:10] = 1\nY[10:20] = 2\nparams = {kernel: \"linear\"}\nc = new Classifier(SVM, params)\nc.train(X,Y)\nxh=-10:10\nplot(X1,\"b.\",\"Points from class 1\",X2,\"r.\",\"Points from class 2\",xh,-(c.b+c.w[0]*xh)./c.w[1],\"_k\",\"separating hyperplane\")\nc.info()", "// Automatic tuning on the\n// image data set from IDA repository\ndata = loadURL(\"examples/image.train\")\nX = data[:, 0:18]\nY = data[:,18]\ndata = loadURL(\"examples/image.test\")\nXt = data[:, 0:18]\nYt = data[:,18]\nsvm = new Classifier(SVM, {kernel: \"rbf\"})\nsvm.tune(X,Y) // takes about 10 seconds\nrecRate = svm.test(Xt,Yt)"], ["svm.html","nonlinearsvm.html"]];

HELPcontent["MSVM"] = ["MachineLearning", "Multi-class support vector machine","msvm = new Classifier(MSVM, params)\nmsvm.train(X, Y)\nmsvm.predict( x )","Create a new M-SVM and train it on a data set X labeled with Y.<br>params should be (a subset of):<br>{<br>MSVMtype: M-SVM model type (\"WW\", \"CS\" (default), \"LLW\" or \"MSVM2\"),<br>kernel: type of kernel function (see help on kernel),<br>kernelpar: value of kernel parameter,<br>C: value of the regularization constant<br>}", ["// Famous Iris data set\ndata = loadURL(\"examples/iris.train\")\nX = data[:, 0:4]\nY = data[:,4]\ndata = loadURL(\"examples/iris.test\")\nXtest = data[:, 0:4]\nYtest = data[:,4]\nmsvm = new Classifier(MSVM, {MSVMtype: \"WW\", kernel: \"rbf\", kernelpar: 1} )\nmsvm.train(X, Y)\nplot( msvm.predict( Xtest ) )\nRecRate = msvm.test( Xtest, Ytest )", "// Handwritten digit recognition\n// with sparse input features\ndata = loadURL(\"examples/usps.train\")\nX = sparse(data[:,0:256])\nY = data[:,256]\ndata = loadURL(\"examples/usps.test\")\nXt = sparse(data[:,0:256])\nYt = data[:,256]\nmsvm = new Classifier(MSVM, {kernel: \"rbf\", kernelpar: 1, C: 10} )\nmsvm.train(X, Y) // takes about 1 minute\n                 // look at the web console for details\nrecRate = msvm.test(Xt, Yt)"] ];

HELPcontent["DecisionTree"] = ["MachineLearning", "Decision tree","dt = new Classifier(DecisionTree, params)\ndt.train(X, Y)\ndt.tune(X, Y)\ndt.predict( x )","Create a new decision tree and train it with knn.train(X,Y) on a data set X labeled with Y. <br>params should be (a subset of):<br>{<br>criterion: \"error\", \"gini\" or \"crossentropy\",<br>tol: number of errors tolerated at a leaf}", "X1 = 5 + randn(10,2)\nX2 = -3 + randn(10,2)\nX = [X1;X2]\nY = zeros(20)\nY[0:10] = 1\nY[10:20] = 2\ndt = new Classifier(DecisionTree)\ndt.train(X,Y)\nplot(dt.predict(X),\"_b\",\"Decision tree predictions\",Y,\".r\",\"true labels\")\ndt.info()", "decisiontree.html"];


HELPcontent["<strong>Regression</strong>"] = ["MachineLearning", "Regression","model = new Regression(algo, params)\nmodel.train(X, Y)\nyhat = model.predict( X )\nmse = model.test(Xt, Yt)\nstats = model.cv(X, Y)","Create a new regression model with the specified algorithm (or the AutoReg method by default). Any regression model can be trained on a data set (X, Y), with a " + htmlmatrix + " or " + htmlvector + " X and a vector Y, used to make predictions (with model.predict), tested (with model.test), cross-validated (with model.cv) or tuned to particular data set (with model.tune). <br><i>algo</i> can be either LeastSquares, KNNreg, RidgeRegression, KernelRidgeRegression, LASSO, OLS, SVR or MLPreg.<br><i>params</i> depends on the chosen algorithm, but typically has an object structure:<br>params = {<br> param1_name: value,<br> param2_name: value,<br>...,<br> affine: true or false (true by default)<br>}<br> For predictions, X can be either a single point or a set of points. ", "x =  0:0.3:10\ny = 2*x + 1 + 2*randn(x.length)\nr = new Regression()\nr.train(x,y)\nplot(x,y,\".k\",x,r.predict(x),\"_b\")\nr.info()", "regression.html"];

HELPcontent["AutoReg"] = ["MachineLearning", "Automatic regression","model = new Regression()\nmodel = new Regression(AutoReg, params)\nmodel.train(X, Y)","Create a new regression model and train it on a data set (X, Y) while choosing the best method and the finest set of hyperparameters. <br>params = {<br>linear: \"auto\", true or false,<br>excludes: Array of names of methods to exclude from the search<br>}<br>The parameter 'linear' can be used to restrict the search among linear or nonlinear methods only.<br><br>The parameters of the resulting model are stored in the 'model' field (displayed with model.model.info() ). ", "x = 0:0.3:10\ny = 2*x + 1 + 2*randn(x.length)\nr = new Regression()\nr.train(x,y)\nplot(x,y,\".k\",x,r.predict(x),\"_b\")\nr.info()" ];

HELPcontent["LeastSquares"] = ["MachineLearning", "Least squares regression","model = new Regression(LeastSquares, params)\nmodel.train(X, Y)","Create a new linear regression model and train it on a data set (X, Y) with the least squares method.<br>params = {affine : true/false} (true by default).", "x = 0:0.3:10\ny = 2*x + 1 + 2*randn(x.length)\nr = new Regression(LeastSquares)\nr.train(x,y)\nplot(x,y,\".k\",x,r.predict(x),\"_b\")\nr.info()", "leastsquares.html"];

HELPcontent["LeastAbsolute"] = ["MachineLearning", "Least absolute deviations","model = new Regression(LeastAbsolute, params)\nmodel.train(X, Y)","Create a new linear regression model and train it on a data set (X, Y) by minimizing the absolute loss.<br>params = {affine : true/false} (true by default).", "x = 0:0.3:10\ny = 2*x + 1 + 2*randn(x.length)\ny[8:10] = 20\nr = new Regression(LeastAbsolute)\nr.train(x,y)\nplot(x,y,\".k\",x,r.predict(x),\"_b\")\nr.info()", "leastabsolute.html"];

HELPcontent["KNNreg"] = ["MachineLearning", "K-nearest neighbors regression","model = new Regression(KNNreg, params)\nmodel.train(X, Y)","Create a new K-nearest neighbors regression model based on the training set (X, Y).<br>The default number of neighbors is K=5.", "x = 0:0.3:10\ny = 2*sin(x) + 0.2*randn(x.length)\nr = new Regression(KNNreg)\nr.train(x,y)\nplot(x,y,\".k\",0:0.1:10,r.predict(0:0.1:10),\"_b\")\nr.info()", "knnregression.html"];

HELPcontent["RidgeRegression"] = ["MachineLearning", "Ridge regression","model = new Regression(RidgeRegression, params)\nmodel.train(X, Y)","Create a new linear regression model and train it on a data set (X, Y) using ridge regression.<br>params = {lambda: value of regularization constant }.", "x = 0:0.3:10\ny = 2*x + 1 + 2*randn(x.length)\nr = new Regression(RidgeRegression, {lambda: 0.1})\nr.train(x,y)\nplot(x,y,\".k\",x,r.predict(x),\"_b\")\nr.info()", "ridgeregression.html"];

HELPcontent["LASSO"] = ["MachineLearning", "LASSO regression","model = new Regression(LASSO, params)\nmodel.train(X, Y)","Create a new linear regression model and train it on a data set (X, Y) using the LASSO (least absolute shrinkage and selection operator). The LASSO is particularly suited to cases where a number of feature variables are irrelevant and only a subset of them should be selected. <br>params = {lambda: value of regularization constant }, the higher lambda is the fewer variables will be selected.", "data = loadURL(\"examples/prostate.scaled.train\")\nX = data[:,0:8]\nY = data[:,8]\ndata = loadURL(\"examples/prostate.scaled.test\")\nXt = data[:,0:8]\nYt = data[:,8]\nr = new Regression(LASSO, {lambda: 50})\nr.train(X,Y)\nmse = r.test(Xt,Yt)\nwLS = [X,ones(Y.length)] \\ Y\nplot(wLS[0:8],\"b\",\"least squares estimates\", r.w,\"r\", \"LASSO estimates\")\nr.w // should have zeros", "lasso.html"];

HELPcontent["LARS"] = ["MachineLearning", "Least angle regression","model = new Regression(LARS, params)\nmodel.train(X, Y)\nW = model.path(X, Y)","Create a new linear regression model and train it on a data set (X, Y) using LARS (least angle regression). The LARS is particularly suited to cases where a number of feature variables are irrelevant and only a subset of them should be selected. model.train() is used to train with a fixed number n of features and model.tune() selects the best n, while model.path() is used to compute the entire path of solutions for all n (with one row in W for each n). <br><br>params = {<br>method: \"lars\" (default) or \"lasso\",<br>n: number of features retained by train() <br>}<br>Note that LARS always use an affine model.", "data = loaddata(\"examples/diabetes.data\")\nX = data[:,0:10]\nY = data[:,10]\nr = new Regression(LARS)\npath = r.path(X,Y)\nmse = norm(Y*ones(path.n)' - [X, ones(X.length)]*path,1)^2 ./ Y.length\nplot(path)\nplot(mse,\"\",\"MSE vs number of variables\")", "lars.html"];

HELPcontent["lars"] = ["MachineLearning", "Least angle regression path","W = lars(X,Y)\nW = lars(X,Y, method, n)","Compute the path of solutions with LARS (least angle regression). 'method' can be: \"lars\" (default) or \"lasso\". The argument n can be used to stop the path after the addition of n variables.<br>NOTE: this function does not build a regression model with train() and predict() functions. Use new Regression(LARS) for this purpose.", "data = loaddata(\"examples/diabetes.data\")\nX = data[:,0:10]\nY = data[:,10]\npath = lars(X,Y)\nplot(path)", "lars.html"];

HELPcontent["OLS"] = ["MachineLearning", "Orthogonal least Squares","model = new Regression(OLS, params)\nmodel.train(X, Y)","Create a new linear regression model and train it on a data set (X, Y) using the OLS (orthogonal least squares) algorithm (a forward stagewise regression), which is particularly suited to cases where a number of feature variables are irrelevant and only a subset of them should be selected. <br>params = {<br>epsilon: tolerance on the error ||y-Xw||,<br> dimension: max number of variables to select,<br> affine: true or false<br> }<br>", "data = loadURL(\"examples/prostate.scaled.train\")\nX = data[:,0:8]\nY = data[:,8]\ndata = loadURL(\"examples/prostate.scaled.test\")\nXt = data[:,0:8]\nYt = data[:,8]\nr = new Regression(OLS, {dimension: 5})\nr.train(X,Y)\nmse = r.test(Xt,Yt)\nwLS = [X,ones(Y.length)] \\ Y\nplot(wLS[0:8],\"b\",\"least squares estimates\", r.w,\"r\", \"OLS estimates\")\nr.w // should have zeros", "lasso.html"];

HELPcontent["MLPreg"] = ["MachineLearning", "Multi-layer perceptron","c = new Regression(MLPreg)\nc = new Regression(MLPreg, params)\nc.train(X, Y)\nc.predict( x )","Create a new Multi-Layer Perceptron for regression and train it on a data set X labeled with Y.<br>params should be (a subset of):<br>{<br>hidden: number of hidden neurons,<br>epochs: max number of epochs,<br>learningRate: value in (0,1),<br>initialweightsvalue: bound for uniform inital weights<br>}", "x = 0:0.05:10\ny = 2*sin(x) + 0.2*randn(x.length)\nr = new Regression(MLPreg, {hidden: 15})\nr.train(x,y)\nplot(x,y,\".k\",x,r.predict(x),\"_b\")\nr.info()", "mlp.html"];

HELPcontent["KernelRidgeRegression"] = ["MachineLearning", "Kernel ridge regression","model = new Regression(KernelRidgeRegression, params)\nmodel.train(X, Y)","Create a new nonlinear regression model and train it on a data set (X, Y) using kernel ridge regression.<br>params should be (a subset of)<br> {<br>lambda: value of regularization constant,<br>kernel: type of kernel function (see help on kernel),<br>kernelpar: the kernel function parameter<br>}.", "x = 0:0.3:10\ny = 2*sin(x) + 0.2*randn(x.length)\nr = new Regression(KernelRidgeRegression)\nr.train(x,y)\nplot(x,y,\".k\",x,r.predict(x),\"_b\")\nr.info()", "kernelridgeregression.html"];

HELPcontent["SVR"] = ["MachineLearning", "Support vector regression","svr = new Regression(SVR, params)\nsvr.train(X, Y)","Create a new support vector regression model and train it on a data set (X, Y).<br>SVR uses the epsilon-insensitive loss function.<br>params = {<br>C: number (regularization constant),<br> epsilon: number (loss function parameter),<br>kernel: type of kernel function (see help on kernel),<br> kernelpar: the kernel function parameter<br>}", "x = 0:0.3:10\ny = 2*sin(x) + 0.2*randn(x.length)\nsvr = new Regression(SVR, {kernel: \"rbf\", epsilon: 0.3})\nsvr.train(x,y)\nyhat = svr.predict(x)\nplot(x,y,\".k\",x,yhat,\"_b\",\"SVR model\",x,yhat+svr.epsilon,\"_g\",\"epsilon tube of insensitivity\",x,yhat-svr.epsilon,\"_g\")\nsvr.info()", ["svr.html","nonlinearsvr.html"]];

HELPcontent["<strong>SwitchingRegression</strong>"] = ["MachineLearning", "Switching regression","model = new SwitchingRegression(algo, params)\nmodel.train(X, Y)\nYhat = model.predict( X )\nyhat = model.predict(X, mode)\nyhat = model.predict(X, modes)\nlabels = model.mode(X, y)","Create a new switching regression model and train it on a data set (X, Y) with the specified algorithm (or k-LinReg by default). params depends on the chosen algorithm but typically includes<br>{<br>affine : true/false (true by default),<br>n: number of modes<br>}. After training, the model can be used to compute predictions or estimate the mode (classify the data)."];

HELPcontent["kLinReg"] = ["MachineLearning", "k-Linear Regressions","model = new SwitchingRegression(kLinReg, params)\nmodel.train(X, Y)","Create a new switching linear regression model and train it on a data set (X, Y) with the k-LinReg method.<br>params = <br>{<br>affine : true/false,<br>n: number of modes<br>restarts: number of restarts (default is 100)<br>}", "x = 10*rand(60)\ny = zeros(60)\ny[0:30] = 2*x[0:30] + 1 + 2*randn(30)\ny[30:60] = -0.5*x[30:60] + 2*randn(30)\nsr = new SwitchingRegression(kLinReg, {n: 2})\nsr.train(x,y)\nYhat = sr.predict(x)\nM = sr.mode(x,y)\ni1 = find(M == 0)\ni2 = find(M == 1)\nplot(x[i1],y[i1],\".b\",x[i2],y[i2],\".r\",x,Yhat[:,0],\"_b\",x,Yhat[:,1],\"_r\")\nsr.info()", "klinreg.html"];


HELPcontent["<strong>DimReduction</strong>"] = ["MachineLearning", "Dimensionality reduction","dr = new DimReduction(algo, params)\nXr = dr.train(X)\nX2r = dr.reduce(X2)\nX = dr.unreduce(Xr)","Create a new dimensionality reduction transformation and train it to reduce the dimensionality d of the N-by-d matrix X with the specified algorithm (or PCA by default).<br>params depends on the chosen algorithm.", "// Image compression with PCA\nX = zeros(30,30)\nfor ( i=0; i< 30; i++) {\n\tfor ( j=0; j< 30; j++) {\n\t\tX[i,j] = i + j\n\t}\n}\ndr = new DimReduction()\nXreduced = dr.train(X)\nimage(X,\"Original image\")\nimage(Xreduced,\"Compressed image\")\nimage(dr.unreduce(Xreduced),\"Uncompressed image\")\ndr.info()"];

HELPcontent["PCA"] = ["MachineLearning", "Principal component analysis","pca = new DimReduction(PCA, params)\nXr = pca.train(X)\nXr = pca.reduce(X)\nX = pca.unreduce(Xreduced)","Create a new dimensionality reduction transformation based on Principal Component Analysis (PCA) of the N-by-d matrix X. <br>params = { energy: e} where e is a number between 0 and 1 representing the minimum fraction of cumulative energy (sum of eigenvalues) conserved in the reduction;<br>or<br>params = {dimension : d} with d the reduced dimension.<br>By default, the method computes the dimension to retain 80% of cumulative energy.", "// Image compression with PCA\nX = zeros(30,30)\nfor ( i=0; i< 30; i++) {\n\tfor ( j=0; j< 30; j++) {\n\t\tX[i,j] = i + j\n\t}\n}\ndr = new DimReduction(PCA)\nXreduced = dr.train(X)\nimage(X,\"Original image\")\nimage(Xreduced,\"Compressed image\")\nimage(dr.unreduce(Xreduced),\"Uncompressed image\")\ndr.info()"];

HELPcontent["LLE"] = ["MachineLearning", "Locally linear embedding","lle = new DimReduction(LLE, params)\nXr = lle.train(X)\nXr = lle.reduce(X)\nX = lle.unreduce(Xreduced)","Create a new dimensionality reduction transformation based on a Locally Linear Embedding of the N-by-d matrix X. <br>params = {<br> dimension: desired reduced dimension,<br>K: number of neighbors per point<br>}.", "// S-shaped 3D data\nN = 100\nt = 3 * PI * (rand(N) - 0.5)\nX = zeros(N,3)\nX[:,0] = sin(t)\nX[:,1] = 2 * rand(N)\nX[:,2] = sign(t) .* (cos(t) - 1)\ndr = new DimReduction(LLE,{dimension: 2})\nXreduced = dr.train(X)\nplot3(X,\"Original data\")\ncolorplot(Xreduced,t,\"Locally linear embedding\")\ndr.info()"];

HELPcontent["ltsa"] = ["MachineLearning", "Local tangent space alignment","Xreduced = ltsa(X, dim, K)","Apply LTSA to reduced the dimensionality of X to dim using K neighbors.", ["// S-shaped 3D data\nN = 100\nt = 3 * PI * (rand(N) - 0.5)\nX = zeros(N,3)\nX[:,0] = sin(t)\nX[:,1] = 2 * rand(N)\nX[:,2] = sign(t) .* (cos(t) - 1)\nXr = ltsa(X,2, 8)\nplot3(X,\"Original data\")\ncolorplot(Xr,t,\"LTSA coordinates\")", "// spiral data\nt = range(100) * (4 * PI / 100)\nX = [t.*cos(t),t.*sin(t)]\nXr = ltsa(X,1,8)\ncolorplot(X,t)\ncolorplot(range(100),Xr,t)" ]];


HELPcontent["<strong>Clustering</strong>"] = ["MachineLearning", "Clustering","clustering = kmeans(X, ...)\nclustering = spectralclustering(X, ...)","Clustering methods perform unsupervised classification of a set of points stored as rows in X into a number of groups. The clustering output is a vector of labels where clustering[i] is the group index of the point X[i,:]. See each method help for more information. " ];

HELPcontent["kmeans"] = ["MachineLearning", "k-means clustering","c = kmeans(X, n)\nc = kmeans(X, n, restarts)","Cluster the data stored row-wise in X into n clusters with k-means using 100 restarts by default.<br>The result contains both the labels (in c.labels) and the centers of the groups also known as the prototypes (stored row-wise in c.centers).", "X1 = 5 + randn(10,2)\nX2 = -3 + randn(10,2)\nX = [X1;X2]\nc = kmeans(X,2)\nplot(X[find(c.labels==0),:],\".b\",\"Points of group 0\",X[find(c.labels==1),:],\".r\",\"Points of group 1\",c.centers,\".g\",\"Centers\")", "kmeans.html"];

HELPcontent["spectralclustering"] = ["MachineLearning", "Spectral clustering","c = spectralclustering(X, n)\nc = spectralclustering(X, n, sigma)\nc = spectralclustering(X, n, A)\nc = spectralclustering(X, n, func)\n","Cluster the data stored row-wise in X into n clusters with spectral clustering using either a Gaussian RBF affinity matrix with parameter sigma (which defaults to 1), a custom affinity matrix A or a custom affinity function func. ", ["// RBF affinity with custom bandwidth\nX1 = randn(50,2)\nX2 = 6 * [sin(0:50), cos(0:50)]\nX = [X1;X2]\nlbls = spectralclustering(X,2,0.5)\nplot(X[find(lbls==0),:],\".b\",\"Points in group 1\", X[find(lbls==1),:],\".r\", \"Points in group 2\")\nplot(lbls, \"b\",\"Sequence of labels\")", "// Custom affinity function\nX1 = [-10:10, -10:10]\nX2 = [-10:10, 8:-1:-12]\nX = [X1;X2] + randn(40,2)\nfunction affinity(x1,x2) {\n return ((mul(x1,x2)/(norm(x1)*norm(x2)))^2)\n}\nlbls = spectralclustering(X,2,affinity)\nplot(X[find(lbls==0),:],\".b\",\"Points in group 1\", X[find(lbls==1),:],\".r\", \"Points in group 2\")\nplot(lbls, \"b\",\"Sequence of labels\")" ], "spectralclustering.html"];


HELPcontent["<strong>ML utils</strong>"] = ["MachineLearning", "Basic tools for machine learning","","The following help topics concern commands providing basic tools for machine learning."];

HELPcontent["distanceMatrix"] = ["MachineLearning", "Distance matrix","D = distanceMatrix( X )","Compute the matrix of pairwise Euclidean distances between rows of X. " ];
HELPcontent["kernel"] = ["MachineLearning", "Kernel functions","val = kernel(x1, x2, Ktype, param)","Evaluate the kernel function K(x1, x2) for the given parameter value. The definition of the kernel function depends on Ktype, which can be any of the following:<br><br>\"linear\": K(x1,x2) = x1'*x2<br>\"rbf\": Gaussian RBF<br>" + htmltab + "K(x1,x2) = exp(-||x1-x2||^2 / (2*param^2)<br>\"poly\": homogeneous polynomial<br>" + htmltab + "K(x1,x2) = (x1'*x2)^param<br>\"polyh\": inhomogeneous polynomial<br>" + htmltab + "K(x1,x2) = (x1'*x2 + 1)^param<br>func: custom kernel function<br>" + htmltab + "K(x1,x2) = func(x1, x2, param)<br><br>The specification of the kernel function type is similar for all machine learning algorithms based on kernels.", "function myK(x1, x2, par) {\n return (par * x1*x2)\n}\nkernel([1,1], [2,2], myK, 0.5)", "kernels.html"];
HELPcontent["kernelFunction"] = ["MachineLearning", "Kernel function","K = kernelFunction(Ktype, param)\nK = kernelFunction(Ktype, param, inputType)","Return a kernel function K to use as K(x1, x2). For multiple evaluations of the same kernel function, this can be much faster than kernel(x1,x2,Ktype,param) which must parse the kernel type and parameter at every call.<br>The definition of the kernel function depends on Ktype, which can be any of the following:<br><br>\"linear\": K(x1,x2) = x1'*x2<br>\"rbf\": Gaussian RBF<br>" + htmltab + "K(x1,x2) = exp(-||x1-x2||^2 / (2*param^2)<br>\"poly\": homogeneous polynomial<br>" + htmltab + "K(x1,x2) = (x1'*x2)^param<br>\"polyh\": inhomogeneous polynomial<br>" + htmltab + "K(x1,x2) = (x1'*x2 + 1)^param<br>func: custom kernel function<br>" + htmltab + "K(x1,x2) = func(x1, x2, param)<br><br>The inputType is \"vector\" by default and must be set to \"number\" for scalar inputs and \"spvector\" for sparse inputs.", ["K = kernelFunction( \"rbf\", 0.5, \"number\")\nK(1.5, 1.9)", "X = randsparse(0.2,100,100)\nspX = sparse(X)\nK = kernelFunction(\"rbf\", 0.3)\nspK = kernelFunction(\"rbf\", 0.3, \"spvector\")\nK1 = K(X[0,:],X[1,:])\nK2 = spK(spX.col(0), spX.col(1))"], "kernels.html"];
HELPcontent["kernelMatrix"] = ["MachineLearning", "Kernel matrix","K = kernelMatrix(X, Ktype, param)\nK = kernelMatrix(X, Ktype, param, Xtest)","Compute the kernel matrix for the data stored as rows in the matrix X with kernel function of type Ktype anda parameter param. If Xtest is provided, then this computes the unsymmetric matrix of size X.n by Xtest.n.", "X = rand(10,5)\nK = kernelMatrix(X, \"rbf\",0.5)"];
HELPcontent["kernelCache"] = ["MachineLearning", "Kernel cache","kc = new kernelCache(X, Ktype, param, size)\nKi = kc.get_row( i )\nkc.update( newparam )","Create a cache to store at most 'size' kernel matrix entries in memory. The memory is filled and accessed with get_row( i ) which returns a row of the kernel matrix. kc.update() is used to update the kernel matrix entries efficiently upon a change of the kernel parameter.", , "fastkernelupdate.html"];
HELPcontent["knnsearch"] = ["MachineLearning", "K-nearest neighbors search","knn = knnsearch(K, x, X)","Search for the K nearest neighbors of x in the rows of X and return their indexes (in knn.indexes) and distances to x (in knn.distances)."];
HELPcontent["normalize"] = ["MachineLearning", "Column normalization","Xn = normalize(X)\nXn = normalize(X, mean, std)\ninfo = normalize(X, true)\n","Normalize the columns of the matrix (or the vector) X to zero mean and unit variance, or by applying the transformation Xn[i,j] = (X[i,j] - mean[j]) / std[j] (if mean and std are provided). The command normalize(X, true) returns the object info = {X: Xn, mean: mean(X,1), std: std(X,1)}." ];
HELPcontent["ar"] = ["MachineLearning", "Auto-regressive data set","data = ar(x, order)","Given a time series x, return an observation matrix data.X with 'order' columns and a target vector data.y to perform time series prediction via regression.", "t = 0:0.3:10\nx = sin(t) + 0.1*randn(t.length)\ndata = ar(x, 2)\nmodel = new Regression()\nmodel.train(data.X, data.y)\nplot(model.predict(data.X),\"b\", data.y,\"r\")\nnext_x = model.predict( [x[x.length-1], x[x.length-2] ])" ];
HELPcontent["loadmodel"] = ["MachineLearning", "Load model","model = loadmodel( url, format)","Load the model stored at the given url in the given format (\"libsvm\" or \"msvmpack\"...).", "svm = loadmodel(\"examples/heart_scale.model\",\"libsvm\")\nsvm.info()" ];
HELPcontent["loaddata"] = ["MachineLearning", "Load data","data = loaddata( url )\ndata = loaddata( url, format)","Load the data stored at the given url in the given format (\"libsvm\", \"msvmpack\"...) and return an object {X: observation matrix, y: label vector}. <br>By default, without a specified format, the data is loaded as a matrix from a text file with one row per line and columns separated by spaces or commas.", ["// Load a data file in default matrix-text format\ndata = loaddata(\"examples/iris.train\")\nX = data[:,0:4]  // get observation matrix\nY = data[:,4]  // get labels from last column", "// Load a data file in libsvm format\ndata = loaddata(\"examples/heart_scale\",\"libsvm\")\nX = data.X  // get observation matrix\nY = data.y  // get labels"] ];

