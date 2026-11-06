---
 标题：《CF 1890D - 多蕾米的连接计划》
 描述：“我们有$n$城市，哪里的城市$i$包含$ai$人们。 最初，每个城市都是孤立的。 城市之间的边缘$i$和$j$仅当属于连接组件的所有城市的总人口包含$i$或者$j$至少是$$i cdot j cdot c." date: "2026-06-09T01:09:44+07:00" tags: ["codeforces", "competitive-programming", "graphs", "greedy", "math", "sortings"] categories: ["algorithms"] codeforces_contest: 1890 codeforces_index: "D" codeforces_contest_name: "Codeforces Round 906 (Div. 2)" rating: 1700 weight: 1890 solve_time_s: 138 verified: true draft: false --- [CF 1890D - Doremy's Connecting Plan](https://codeforces.com/problemset/problem/1890/D) **Rating:** 1700   **Tags:** graphs, greedy, math, sortings   **Solve time:** 2m 18s   **Verified:** yes   ## Solution ## Problem Understanding We have $n$ cities, where city $i$ contains $a_i$ people. Initially every city is isolated. An edge between cities $i$ and $j$ can be added only if the total population of all cities belonging to the connected components containing $i$ or $j$ is at least$$i \cdot j \cdot c．$$
Whenever we connect two different components, their populations merge and become available for future operations.
The task is to determine whether there exists some sequence of edge additions that eventually makes the whole graph connected.
The constraints are the first clue. The total number of cities across all test cases is at most $2 \cdot 10^5$, which strongly suggests an $O(n \log n)$ solution. Any algorithm that repeatedly scans all pairs of cities would require $O(n^2)$ or worse operations, which would be far too slow for $n=2\cdot10^5$.
The tricky part is that the validity of an edge depends on the current connected components, not only on the endpoints. After several merges, a previously impossible edge may become possible because the component population has grown.
A common mistake is to think that any pair of cities can serve as the next merge candidate. The city indices appear in the cost formula, and index $1$ is special because
$$1 \cdot i \cdot c = i c$$
is the smallest possible cost involving city $i$.
Consider:
⟦PROTECT_0⟧
City $1$ alone already has population $100$. It can connect to city $2$ because $100+1 \ge 20$, then to city $3$ because $101+1 \ge 30$. The answer is YES.
A naive strategy that tries to connect arbitrary cheapest pairs first may fail to notice that city $1$ is the natural hub.
Another subtle case is:
⟦PROTECT_1⟧
The answer is NO. Although the total population is positive, city $1$ cannot connect to city $2$ because $0+0 < 2$, and city $1$ cannot connect to city $3$ because $0+2 < 3$. No merge is possible.
The solution must correctly identify when the growth process gets stuck before reaching all cities.
## Approaches
A brute-force simulation would treat each city as its own component and repeatedly search for any pair of components that can be merged.
To test whether two components can be connected, we would need their total population and some pair of cities capable of satisfying the inequality. Even with a disjoint-set structure, searching all component pairs after every merge is expensive. There can be $O(n)$ merges, and each step may examine $O(n^2)$ candidates, leading to $O(n^3)$ behavior in the worst case.
The key observation is that city $1$ dominates the problem.
Suppose we already have a component containing city $1$, with total population $S$. To attach city $i$ directly to this component, we need
$$S + a_i \ge i \cdot c.$$
This is the cheapest possible way to bring city $i$ into the growing component, because every other city index $j\ge1$ gives
$$i \cdot j \cdot c \ge i \cdot c。$$
If city $i$ cannot be attached to the component containing city $1$, then connecting it through some other city cannot be easier.
This transforms the problem into a growth process.
Start with the component containing city $1$. Its current population is $a_1$.
For every city $i>1$, define its contribution:
$$增益_i = a_i - i c。$$
If the current population is $S$, then city $i$ is attachable exactly when
$$S + 增益_i \ge 0。$$
After attaching it, the population becomes
$$S \leftarrow S + a_i。$$
Among all currently attachable cities, we should take the one with the largest contribution $gain_i$. This maximizes future population growth and can never hurt.
The resulting process is identical to a classic greedy problem. We sort cities by $gain_i$ in descending order and keep adding cities while the current population is large enough to satisfy the corresponding requirement.
If every city can be added, the graph can be connected. Otherwise it cannot.
| Approach | Time Complexity | Space Complexity | Verdict |
| --- | --- | --- | --- |
| Brute Force | $O(n^3)$ worst case | $O(n)$ | Too slow |
| Optimal Greedy + Sorting | $O(n \log n)$ | $O(n)$ | Accepted |
## Algorithm Walkthrough
1. Start with the component containing city $1$. Let its current population be $S=a_1$.
2. For every city $i\ge2$, compute
$$增益_i = a_i - i c。$$
This quantity measures how much population remains after paying the minimum possible connection cost involving city $1$.
3. Sort all cities $i\ge2$ by $gain_i$ in descending order.
4. Process the sorted cities from largest gain to smallest.
5. For the current city, check whether
$$S + 增益_i \ge 0。$$
This is equivalent to
$$S + a_i \ge i c,$$
meaning the city can be connected directly to the component containing city $1$.
6. If the condition fails for some city, output `"NO"`.
The remaining cities have gain no larger than the current one, so none of them can be connected either.
7. Otherwise merge the city into the component and update
$$S \leftarrow S + a_i。$$
8. After all cities are processed successfully, output `"YES"`.
### Why it works
Let $S$ be the population of the component containing city $1$.
For any city $i$, the cheapest possible way to attach it to that component is using an edge involving city $1$, whose requirement is $i c$. Any edge using another city $j$ requires $i j c$, which is never smaller.
Hence a city is usable exactly when $S+a_i \ge i c$.
Suppose several cities are currently usable. Choosing the city with the largest gain adds the most population to $S$, producing the largest possible future component. If a solution exists after choosing some other city, it also exists after choosing the largest-gain city because the component population is at least as large afterward.
This exchange argument shows that the greedy choice is always safe. If the greedy process gets stuck at some city, no alternative ordering could have produced a larger current population, so no valid sequence exists.
## Python Solution
⟦PROTECT_2⟧
The variable `cur` stores the population of the component containing city $1$.
For every other city we store two values. The first is `gain = a[i] - i*c`, which determines whether the city can currently be attached. The second is its population, which will be added to `cur` after the merge.
Sorting by descending gain implements the greedy choice. The check
⟦PROTECT_3⟧
is exactly the condition
$$cur + a_i < i c.$$
 如果失败，城市就无法连接。 由于所有剩余收益更小，因此也无法连接后面的城市。 
Python 整数自动处理高达$10^{12}$及以上，因此不存在溢出风险。 在具有固定宽度整数的语言中，需要 64 位算术。 
## 工作示例
 ### 示例 1
 输入：```
4 10
0 20 15 10
```计算增益：
 | 城市 | 人口| 增益 = ai - i*c |
 | ---| ---| ---|
 | 2 | 20 | 0 |
 | 3 | 15 | 15 -15 | -15
 | 4 | 10 | 10 -30 |
 排序顺序仍然保留$2,3,4$。 
| 步骤| 当前 S | 增益| 检查 S+增益 >= 0 | 新S |
 | ---| ---| ---| ---| ---|
 | 开始| 0 | - | - | 0 |
 | 城市2 | 0 | 0 | 是的 | 20 |
 | 城市3 | 20 | -15 | -15 是的 | 35 | 35
 | 城市 4 | 35 | 35 -30 | 是的 | 45 | 45
 所有城市都已连接，所以答案是肯定的。 
此示例显示了组件如何随着时间的推移而增长。 早期合并增加了可用人口，并使以后的合并成为可能。 
### 示例 2
 输入：```
5 2
1 1 3 1 1
```计算增益：
 | 城市 | 人口| 增益|
 | ---| ---| ---|
 | 2 | 1 | -3 |
 | 3 | 3 | -3 |
 | 4 | 1 | -7 |
 | 5 | 1 | -9 |
 排序增益：$-3,-3,-7,-9$。 
| 步骤| 当前 S | 增益| 检查 S+增益 >= 0 |
 | ---| ---| ---| ---|
 | 开始| 1 | - | - |
 | 第一城市 | 1 | -3 | 没有 |
 该过程立即停止，所以答案是否定的。 
这表明人口总数为正值是不够的。 包含城市的组件$1$必须能够开始成长。 
## 复杂度分析
 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n \log n)$| 排序$n-1$收益占主导地位|
 | 空间|$O(n)$| 收益和人口的储存|
 全部的总和$n$跨测试用例的值最多是$2\cdot10^5$。 一个$O(n \log n)$算法很容易满足 Python 中 1 秒的限制，并且内存使用量完全低于 256 MB 的限制。 
## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    def solve():
        input = sys.stdin.readline
        t = int(input())
        out = []
        for _ in range(t):
            n, c = map(int, input().split())
            a = list(map(int, input().split()))
            cur = a[0]
            cities = []
            for i in range(2, n + 1):
                cities.append((a[i - 1] - i * c, a[i - 1]))
            cities.sort(reverse=True)
            ok = True
            for gain, pop in cities:
                if cur + gain < 0:
                    ok = False
                    break
                cur += pop
            out.append("YES" if ok else "NO")
        return "\n".join(out)
    return solve()
# provided sample
assert run(
"""7
4 10
0 20 15 10
2 1
1 1
5 1
0 1 0 4 199
5 2
1 1 3 1 1
5 5
5 6 1 10 2
5 1000000
1000000000000 1000000000000 1000000000000 1000000000000 1000000000000
3 1
0 0 2
"""
) == """YES
YES
YES
NO
NO
YES
NO"""
# minimum size, connectable
assert run(
"""1
2 1
10 0
"""
) == "YES"
# minimum size, not connectable
assert run(
"""1
2 5
0 0
"""
) == "NO"
# all equal values
assert run(
"""1
4 1
5 5 5 5
"""
) == "YES"
# city 1 cannot start growing
assert run(
"""1
3 1
0 0 2
"""
) == "NO"
# large value boundary
assert run(
"""1
2 1000000
1000000000000 1000000000000
"""
) == "YES"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 1 / 10 0`| 是 | 最小有效实例 |
 |`2 5 / 0 0`| 否 | 最小无效实例 |
 | 所有值都等于 5 | 是 | 贪心排序无所谓|
 |`0 0 2`| 否 | 包含城市 1 的组件无法开始增长 |
 | 大的$10^{12}$价值观 | 是 | 正确处理 64 位标度数字 |
 ## 边缘情况
 考虑：```
1
3 1
0 0 2
```最初$S=0$。 唯一的收获就是$-2$和$-1$。 排序后，第一个候选仍然满足$S+gain<0$。 该算法立即返回“否”。 现实中也无法添加边缘，所以答案是正确的。 
考虑：```
1
2 1
1 1
```我们从$S=1$。 第二城有收获$1-2=-1$。 自从$1+(-1)=0$，允许合并。 该算法接受并输出 YES。 这捕获了一个常见的差一错误，即有人使用`<=`而不是`<`。 
考虑：```
1
4 10
0 20 15 10
```初始组件的人口为零。 粗心的解决方案可能会立即被拒绝。 相反，算法会按增益顺序检查城市。 城市$2$有增益$0$，使得第一次合并成为可能。 此后，该组件将增长，并且可以到达其余城市。 正确答案是肯定的。 
考虑：```
1
5 5
5 6 1 10 2
```按人口计算，最美丽的城市是 city$4$，但它最初不可连接。 按增益排序正确地优先考虑了实际可以合并的城市。 该过程最终陷入困境，算法输出“否”，与官方答案相符。
