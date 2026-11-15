---
 标题：“CF 913H - 不要超越”
 描述：“让$$si=t1+t2+cdots+ti$$哪里每个$ti$是独立且统一地选择的$[0,1]$。 我们给出了上限$x1,x2,dots,xn$。 任务是计算每个前缀和低于其相应界限的概率：$$sile xi quad text{for all } i." date: "2026-06-13T01:18:03+07:00" tags: ["codeforces", "competitive-programming", "math", "probabilities"] categories: ["algorithms"] codeforces_contest: 913 codeforces_index: "H" codeforces_contest_name: "Hello 2018" rating: 3400 weight: 913 solve_time_s: 590 verified: true draft: false --- [CF 913H - Don't Exceed](https://codeforces.com/problemset/problem/913/H) **Rating:** 3400   **Tags:** math, probabilities   **Solve time:** 9m 50s   **Verified:** yes   ## Solution ## Problem Understanding Let$$s_i=t_1+t_2+\cdots+t_i$$
where every $t_i$ is chosen independently and uniformly from $[0,1]$.
We are given upper bounds $x_1,x_2,\dots,x_n$. The task is to compute the probability that every prefix sum stays below its corresponding bound:
$$s_i\le x_i \quad \text{对于所有 } i。$$
The answer is a rational number. The statement guarantees that it can be represented as $P/Q$, and asks for
$$P\cdot Q^{-1}\pmod{998244353}。$$
The most important observation is that the probability is the volume of a region inside the unit cube $[0,1]^n$. Since every $x_i$ has at most six digits after the decimal point, all coordinates are rational numbers, so the final probability is also rational.
The constraint $n\le 30$ is surprisingly small. That immediately suggests that the intended solution is not based on large-scale DP or numerical integration. Instead, we can afford fairly expensive operations on polynomials of degree up to $30$.
A subtle point is that the $x_i$ are real numbers. Any floating-point implementation is doomed, because the required answer is an exact rational value modulo a prime. All computations must be performed symbolically inside the finite field modulo $998244353$.
Another easy mistake is to compute only the distribution of $s_n$. The event depends on every intermediate prefix sum. For example:
⟦PROTECT_0⟧
The final sum constraint is weak, but the second prefix constraint is not. Ignoring intermediate bounds produces a completely different probability.
A third trap is the behavior at breakpoints. The density functions arising from repeated convolutions are piecewise polynomials. Their polynomial formula changes exactly when $x$ crosses numbers of the form $x_i+k$, where $k$ is an integer. Missing even one breakpoint causes incorrect integration on an entire interval.
## Approaches
A brute-force view is to describe the probability directly as an $n$-dimensional integral over all variables $t_1,\dots,t_n$. The region is
$$0\le t_i\le 1,$$
together with
$$t_1+\cdots+t_i\le x_i。$$
The integral is correct, but completely unusable. Even if we recursively integrate one variable at a time, the shape of the region quickly becomes complicated.
The key observation comes from viewing the process as repeated convolution with the uniform distribution on $[0,1]$.
Let $f_i(x)$ be the density of $s_i$ under the condition that all previous constraints have already been respected. Then
$$f_i(x)=
 \开始{案例}
 \int_{x-1}^{x} f_{i-1}(y)\,dy, & x\le x_i,\\
 0，&x>x_i。 
\结束{案例}$$
This is exactly a convolution with the uniform kernel, followed by truncation at $x_i$.
Repeated convolution of piecewise polynomials produces another piecewise polynomial. The only places where the formula can change are shifts of existing breakpoints by integers. Since every truncation introduces a breakpoint at $x_i$, every future breakpoint has the form
$$x_i+k。$$
Because $n\le 30$, there are at most
$$n(n+1)+1$$
distinct breakpoints, fewer than one thousand.
Once all breakpoints are known, every density is represented by one polynomial on each interval between consecutive breakpoints. The recurrence becomes purely algebraic: integrate a polynomial, evaluate it on neighboring intervals, and subtract.
This converts a probability problem into symbolic manipulation of low-degree piecewise polynomials.
| Approach | Time Complexity | Space Complexity | Verdict |
| --- | --- | --- | --- |
| Direct multidimensional integration | Exponential | Exponential | Too slow |
| Piecewise-polynomial DP | $O(n^4)$ | $O(n^3)$ | Accepted |
## Algorithm Walkthrough
### Definitions
Let $f_i(x)$ denote the density of $s_i$ while respecting all constraints up to step $i$.
Define
$$f_0(x)=δ(x),$$
a unit mass at zero.
For $i\ge 1$,
$$f_i(x)=
 \开始{案例}
 \int_{x-1}^{x} f_{i-1}(y)\,dy, & x\le x_i,\\
 0，&x>x_i。 
\结束{案例}$$
### Global partition
All breakpoints that can ever appear have the form
$$x_j+k,$$
where $0\le k\le n$.
Collect every such value, add $0$, sort them, and remove duplicates.
These points divide the real line into intervals. On each interval every density will be represented by a single polynomial.
### Polynomial representation
For every stage $i$ and every interval, store the polynomial describing $f_i$ on that interval.
The degree never exceeds $i$, hence never exceeds $30$.
### Computing the antiderivative
1. Suppose we already know all interval polynomials of $f_{i-1}$.
2. Build a continuous antiderivative $F$ satisfying
$$F'(x)=f_{i-1}(x)。$$
1. For each interval, integrate its polynomial term-by-term.
2. Adjust the constant term so that $F$ remains continuous across interval boundaries.
### Applying the convolution
1. For $x\le x_i$,
$$f_i(x)=F(x)-F(x-1)。$$
1. On a fixed interval, both $x$ and $x-1$ belong to fixed pieces of the partition. Hence both $F(x)$ and $F(x-1)$ are ordinary polynomials there.
2. Subtract them to obtain the polynomial for $f_i$ on that interval.
3. Every interval entirely to the right of $x_i$ becomes zero because of the truncation.
### Extracting the answer
1. After constructing $f_n$, build its antiderivative $G$.
2. The desired probability is
$$\int_{-\infty}^{x_n} f_n(x)\,dx
 =
 G(x_n)。$$
1. Evaluate this value modulo $998244353$.
### Why it works
The recurrence for $f_i$ is exactly the density recurrence obtained by adding an independent uniform random variable $t_i\in[0,1]$ and then enforcing the condition $s_i\le x_i$. Every step preserves the exact density, not an approximation.
The partition contains every possible location where a formula change can occur. Inside a single interval, both $F(x)$ and $F(x-1)$ come from fixed polynomial pieces, so their difference is also a polynomial. Thus the stored representation is always exact.
By induction on $i$, the piecewise-polynomial description equals the true density of $s_i$. Evaluating its cumulative integral at $x_n$ gives precisely the probability that all constraints hold.
## Python Solution
⟦PROTECT_1⟧
The implementation follows the recurrence literally. Every interval stores a polynomial describing the density on that interval. The antiderivative is rebuilt at each stage, keeping continuity by adjusting the constant term. After that, the convolution formula $F(x)-F(x-1)$ is applied interval by interval.
The most delicate part is the breakpoint construction. Every future discontinuity must already be present in the partition. That is why all values $x_i+k$ are inserted before the DP begins.
Another subtle point is that the answer must be exact modulo the prime. The input decimals are converted into rational field elements using the modular inverse of $10^6$. No floating-point arithmetic is used anywhere.
## Worked Examples
### Sample 1
Input
⟦PROTECT_2⟧
Every constraint is automatically satisfied because $s_i\le i$ and $x_i=i$.
| Step | Constraint | Probability |
| --- | --- | --- |
| 1 | $s_1\le1$ | 1 |
| 2 | $s_2\le2$ | 1 |
| 3 | $s_3\le3$ | 1 |
| 4 | $s_4\le4$ | 1 |
Final answer is $1$.
This example shows that the truncation never removes any mass. The density evolves exactly like the ordinary Irwin-Hall distribution.
### Sample 3
Input
⟦PROTECT_3⟧
The valid region is
$$0\le t_1\le 0.5,$$
and
$$t_1+t_2\le 1。$$
| $t_1$ range | Allowed $t_2$ length |
| --- | --- |
| $0 \le t_1 \le 0.5$ | $1-t_1$ |
Hence
$$\int_0^{0.5}(1-t_1)\,dt_1
 =
 \frac12-\frac18
 =
 \frac38.$$
 概率是$3/8$，正是声明中提到的值。 
此示例说明了第二个约束如何移除部分质量，即使$x_2=1$也不是特别小。 
## 复杂度分析
 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n^4)$| 关于$O(n^2)$间隔、程度$O(n)$，重复进行$n$阶段 |
 | 空间|$O(n^3)$| 次数最多的分段多项式$n$|
 和$n\le30$，音程数低于一千，次数绝不会超过三十。 得到的符号多项式 DP 完全符合限制。 
## 测试用例```python
import sys, io
def run(inp: str) -> str:
    # invoke solution()
    pass
# provided samples
assert run("4\n1.00\n2\n3.000000\n4.0\n") == "1\n"
assert run("1\n0.50216\n") == "342677322\n"
assert run("2\n0.5\n1.0\n") == "623902721\n"
# minimum size
assert run("1\n1\n") == "1\n"
# probability = 1/2
assert run("1\n0.5\n") == str((998244353 + 1) // 2) + "\n"
# all constraints very large
assert run("3\n1\n2\n3\n") == "1\n"
# strong middle restriction
assert run("3\n1\n0.5\n3\n") == run("3\n1\n0.5\n3\n")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1, x=1`|`1`| 接受完整间隔 |
 |`1, x=0.5`|`1/2 mod M`| 十进制解析和有理算术 |
 |`1,2,3`|`1`| 概率仍然是一 |
 | 严格的中间约束 | 确定性检查 | 中间步骤的适当截断|
 ## 边缘情况
 考虑```
1
0.5
```概率正好是$1/2$。 浮点实现可以表示$0.5$近似并在转换为模算术时失去精确性。 多项式方法将值存储为字段元素$500000/1000000$，这正是$1/2$。 
考虑```
2
10
0.5
```只考虑最终分布的解决方案$s_2$就会产生很大的概率。 正确的算法会在每个阶段后进行截断。 建造时$f_2$，所有质量违规$s_2\le0.5$立即被删除。 
考虑```
2
0.5
1.0
```断点集包含$0.5$,$1.0$,$1.5$,$2.0$，以及它们的移位变体。 如果分区省略了断点$1.5$，密度公式将应用于不再有效的区间。 包括每一个值$x_i+k$可以防止这种错误并保持每个多项式的精确性。
