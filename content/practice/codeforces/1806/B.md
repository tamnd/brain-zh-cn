---
 标题：“CF 1806B - 墨西哥大师”
 描述：“我们得到一个数组，可以随意排列它的元素。选择排序后，我们构建一个由相邻元素之和组成的新数组：$$b=[a1+a2, a2+a3, ldots, a{n-1}+an]." date: "2026-06-09T09:11:13+07:00" tags: ["codeforces", "competitive-programming", "constructive-algorithms", "greedy"] categories: ["algorithms"] codeforces_contest: 1806 codeforces_index: "B" codeforces_contest_name: "Codeforces Round 858 (Div. 2)" rating: 900 weight: 1806 solve_time_s: 290 verified: false draft: false --- [CF 1806B - Mex Master](https://codeforces.com/problemset/problem/1806/B) **Rating:** 900   **Tags:** constructive algorithms, greedy   **Solve time:** 4m 50s   **Verified:** no   ## Solution ## Problem Understanding We are given an array and may permute its elements however we like. After choosing an ordering, we build a new array consisting of sums of neighboring elements:$$b=[a_1+a_2,\a_2+a_3,\\l点,\a_{n-1}+a_n]。$$
The score of the arrangement is the MEX of $b$, where MEX is the smallest non-negative integer that does not appear.
Our task is not to construct the optimal ordering. We only need the minimum possible score obtainable after rearranging the original numbers.
The constraints immediately suggest that the answer must come from a simple structural observation. The total length over all test cases is only $2\cdot 10^5$, so an $O(n)$ or $O(n \log n)$ solution per test case is easily fast enough. Any approach that tries many permutations is hopeless because even $n=20$ already makes enumeration impossible.
The interesting part is that only the values $0$, $1$, and "greater than $1$" matter.
Consider a few edge cases.
If there is a positive number between every pair of zeros, then no adjacent pair sums to $0$. For example:
⟦PROTECT_0⟧
The adjacent sums are:
⟦PROTECT_1⟧
MEX is $0$.
A careless solution that only checks whether zeros exist would incorrectly return $1$.
Now consider:
⟦PROTECT_2⟧
The only adjacent sum is:
⟦PROTECT_3⟧
MEX is $1$.
Finally:
⟦PROTECT_4⟧
No matter how we arrange the numbers, at least one adjacent pair of zeros exists. That creates a sum $0$. At the same time, every positive number is at least $2$, so sum $1$ can never appear. The resulting minimum MEX is $1$.
These examples already hint that only the counts of zeros and ones control the answer.
## Approaches
A brute-force solution would try every permutation of the array. For each permutation it would build the adjacent-sum array, compute its MEX, and keep the minimum.
This is correct because it directly checks every possible arrangement. Unfortunately, it requires $n!$ permutations. Even $n=12$ would already be completely infeasible.
The key observation is that the minimum possible MEX can only be $0$, $1$, or $2$.
To obtain MEX $0$, we need to avoid creating a sum equal to $0$. Since all values are non-negative, the only way to get a sum $0$ is with two adjacent zeros.
Thus MEX $0$ is possible exactly when we can arrange the array so that no two zeros are adjacent.
Suppose there are $z$ zeros and $p=n-z$ positive numbers.
Each positive number can separate at most one gap between consecutive zeros. To place all zeros without adjacency we need
$$z \le p+1。$$
Equivalently,
$$z \le n-z+1。$$
If this holds, we can eliminate all occurrences of $0$ from the adjacent-sum array, so MEX becomes $0$.
Now assume $z>p+1$. Then some pair of adjacent zeros is unavoidable, so $0$ must appear.
Can we make MEX equal to $1$? We need $0$ to appear but $1$ not to appear.
A sum $1$ can only be produced by $0+1$, because all numbers are non-negative integers.
If the array contains no ones, then sum $1$ is impossible, hence the answer is immediately $1$.
The only remaining situation is:
$$z>p+1$$
 并且至少有一个值等于$1$。 
然后$0$是不可避免的，并且有些$0+1$邻接也是不可避免的。 在这种情况下，两者$0$和$1$出现，所以最小 MEX 是$2$。 
这完全决定了答案。 
| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n!\cdot n)$|$O(n)$| 太慢了|
 | 最佳 |$O(n)$|$O(1)$| 已接受 |
 ## 算法演练
 1.统计0的个数，调用$z$。 
2. 数一下个数，调用它$o$。 
3.让$p=n-z$，正元素的数量。 
4. 如果$z \le p+1$， 输出$0$。 
在这种情况下，零可以被正元素分隔，因此没有相邻对的总和为$0$。 自从$0$相邻和数组中不存在，其 MEX 为$0$。 
5. 否则，一些相邻的零对是不可避免的，所以$0$出现。 
6. 如果$o=0$， 输出$1$。 
一笔$1$需要一个$0$和一个$1$。 没有任何一个，总和$1$不可能发生。 
7.否则输出$2$。 
这里$0$出现是因为相邻的零是不可避免的，并且$1$也可能被迫出现，因为$1$存在。 最小的缺失值变为$2$。 
### 为什么它有效
 创建总和的唯一方法$0$是与相邻的零。 因此实现 MEX 的可能性$0$完全取决于是否可以将所有零分开。 
如果零不能全部分开，那么$0$必然属于邻接和数组。 下一个问题是是否$1$是可以避免的。 
因为所有值都是非负的，所以唯一的表示$1$两个数组元素的总和是$0+1$。 如果没有元素等于$1$存在，则求和$1$是不可能的，而 MEX 是$1$。 否则两者$0$和$1$发生，迫使墨西哥$2$。 
不可能有其他答案。 
## Python 解决方案```python
import sys
input = sys.stdin.readline
def solve():
    t = int(input())
    ans = []
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        zeros = a.count(0)
        ones = a.count(1)
        positive = n - zeros
        if zeros <= positive + 1:
            ans.append("0")
        elif ones == 0:
            ans.append("1")
        else:
            ans.append("2")
    sys.stdout.write("\n".join(ans))
if __name__ == "__main__":
    solve()
```实现直接遵循证明。 
变量`zeros`确定是否可以避免相邻的零。 条件`zeros <= positive + 1`正是上面导出的分隔符​​条件。 
如果相邻的零是不可避免的，我们只需要知道是否有元素等于`1`。 其他值都不重要，因为只有`0+1`可以产生等于`1`。 
所有算术都可以轻松地适合标准 Python 整数。 
## 工作示例
 ### 示例 1
 输入：```
3
0 0 1
```| 数量 | 价值|
 | --- | --- |
 | 零| 2 |
 | 那些 | 1 |
 | 积极| 1 |
 | 检查 |$2 \le 1+1$|
 由于条件成立，因此可以分隔零：```
0 1 0
```相邻总和：```
1 1
```墨西哥是$0$。 
回答：```
0
```这表明仅仅有零并不能强制求和$0$出现。 
### 示例 2
 输入：```
8
1 0 0 0 2 0 3 0
```| 数量 | 价值|
 | --- | --- |
 | 零| 5 |
 | 那些 | 1 |
 | 积极| 3 |
 | 检查 |$5 \le 3+1$是假的 |
 相邻的零是不可避免的，所以$0$出现。 
一个值$1$存在，因此求和$1$也可能发生。 
因此两者$0$和$1$属于邻接和数组，使得最小 MEX 等于$2$。 
回答：```
2
```这正是第三个样本。 
## 复杂度分析
 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n)$| 一次计算零和一 |
 | 空间|$O(1)$| 仅存储了几个计数器|
 所有测试用例的总输入大小最多为$2\cdot10^5$，因此每个阵列的线性扫描很容易符合限制。 
## 测试用例```python
import sys
import io
def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline
    t = int(input())
    out = []
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        zeros = a.count(0)
        ones = a.count(1)
        positive = n - zeros
        if zeros <= positive + 1:
            out.append("0")
        elif ones == 0:
            out.append("1")
        else:
            out.append("2")
    return "\n".join(out)
# provided samples
assert run(
"""3
2
0 0
3
0 0 1
8
1 0 0 0 2 0 3 0
"""
) == "1\n0\n2"
# minimum size
assert run(
"""1
2
5 7
"""
) == "0"
# all zeros
assert run(
"""1
5
0 0 0 0 0
"""
) == "1"
# many zeros and a one
assert run(
"""1
5
0 0 0 0 1
"""
) == "2"
# enough positive separators
assert run(
"""1
6
0 0 1 2 3 4
"""
) == "0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`5 7`|`0`| 零和不可能存在 |
 |`0 0 0 0 0`|`1`| 相邻的零是不可避免的，没有 |
 |`0 0 0 0 1`|`2`| 相邻的零不可避免，但存在一个 |
 |`0 0 1 2 3 4`|`0`| 正数可以分隔所有零 |
 ## 边缘情况
 考虑：```
2
0 0
```这里`zeros = 2`,`positive = 0`。 条件`2 <= 1`是假的。 没有人，所以答案是`1`。 唯一的相邻和是`0`，其 MEX 确实是`1`。 
考虑：```
3
0 0 1
```这里`zeros = 2`,`positive = 1`。 条件`2 <= 2`是真的。 我们可以将数字排列为`0 1 0`，产生相邻和`1, 1`。 自从`0`不存在，答案是`0`。 
考虑：```
5
0 0 0 0 1
```这里`zeros = 4`,`positive = 1`。 条件`4 <= 2`为假，因此必须存在一些相邻的零。 自从一个`1`存在，两个总和`0`和`1`可能会发生。 答案是`2`。 
这些案例涵盖了解决方案的每个可能的分支。
