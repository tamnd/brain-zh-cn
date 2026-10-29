---
 标题：“CF 1490C - 立方之和”
 描述：“我们有几个数字，对于每个数字$x$，我们必须确定它是否可以写成两个正立方之和。 换句话说，我们想知道是否存在正整数$a$和$b$这样$$a^3 + b^3 = x." date: "2026-06-10T22:37:19+07:00" tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "math"] categories: ["algorithms"] codeforces_contest: 1490 codeforces_index: "C" codeforces_contest_name: "Codeforces Round 702 (Div. 3)" rating: 1100 weight: 1490 solve_time_s: 150 verified: true draft: false --- [CF 1490C - Sum of Cubes](https://codeforces.com/problemset/problem/1490/C) **Rating:** 1100   **Tags:** binary search, brute force, math   **Solve time:** 2m 30s   **Verified:** yes   ## Solution ## Problem Understanding We are given several numbers, and for each number $x$, we must determine whether it can be written as the sum of two positive cubes. In other words, we want to know whether there exist positive integers $a$ and $b$ such that$$a^3 + b^3 = x。$$
The answer for each test case is simply "YES" if such a pair exists and "NO" otherwise.
The largest possible value of $x$ is $10^{12}$. That bound immediately tells us something useful about the size of the search space. Since
$$10000^3 = 10^{12},$$
any cube participating in the sum must come from an integer no larger than about 10,000.
A naive search over all pairs $(a,b)$ would require checking roughly $10^4 \times 10^4 = 10^8$ combinations for a single test case. With up to 100 test cases, that becomes completely impractical.
The constraints suggest that an algorithm around $10^4$ operations per test case is perfectly reasonable, while $10^8$ operations per test case is not.
There are a few easy-to-miss edge cases.
Consider:
⟦PROTECT_0⟧
The correct answer is:
⟦PROTECT_1⟧
Although $1 = 1^3$, the problem requires a sum of two positive cubes. The smallest possible sum is $1^3 + 1^3 = 2$.
Consider:
⟦PROTECT_2⟧
The correct answer is:
⟦PROTECT_3⟧
because $16 = 2^3 + 2^3$. A careless implementation that only checks distinct values of $a$ and $b$ would incorrectly reject this case.
Consider:
⟦PROTECT_4⟧
The correct answer is:
⟦PROTECT_5⟧
because $2 = 1^3 + 1^3$. This is the smallest valid representation and is a useful boundary test.
Another common mistake is using floating-point cube roots. For values near $10^{12}$, rounding errors can cause an exact cube to be missed. Integer arithmetic avoids that problem entirely.
## Approaches
The most direct solution is to try every possible pair $(a,b)$. Since every relevant cube root is at most about 10,000, we could iterate through all values of $a$ and $b$, compute $a^3+b^3$, and check whether it equals $x$.
This approach is correct because it explicitly examines every candidate pair. The problem is the running time. Roughly $10^8$ pairs must be checked for a single test case, which is far beyond what fits within the time limit.
The key observation is that once we choose one cube, the other cube is completely determined.
Suppose we fix $a$. Then we need
$$b^3 = x - a^3.$$
 而不是尝试一切可能$b$，我们只需要判断该值是否$x-a^3$本身就是一个完美的立方体。 
由于只有大约 10,000 个可能的立方体值，我们可以预先计算最多可达的所有立方体$10^{12}$并将它们存储在哈希集中。 那么对于每个候选人$a$，我们计算$x-a^3$并执行$O(1)$集合中的成员资格测试。 
这将搜索从检查所有对减少为仅检查所有可能的第一个元素。 
| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(M^2)$|$O(1)$| 太慢了|
 | 最佳 |$O(M)$|$O(M)$| 已接受 |
 这里$M \approx 10^4$，最大可能的立方根。 
## 算法演练
 1. 预先计算所有立方体$i^3$对于正整数$i$尽管$i^3 \le 10^{12}$。 
2. 将这些多维数据集存储在哈希集中。 这允许恒定时间检查一个数字是否是我们预先计算范围内的完美立方体。 
3. 对于每个测试用例，请阅读$x$。 
4. 迭代每个预先计算的立方体值$c=a^3$。 
5. 计算剩余价值$x-c$。 
6. 检查是否$x-c$存在于立方体集合中。 
7. 如果存在，则$x=a^3+b^3$对于某个正整数$b$，所以输出`"YES"`并停止处理这个测试用例。 
8. 如果循环结束后没有找到匹配项，则输出`"NO"`。 
### 为什么它有效
 该算法检查第一个立方体的每个可能值$a^3$。 对于任何有效的表示$x=a^3+b^3$，迭代最终将达到特定的$a^3$。 此时，计算出的余数等于$b^3$，它存在于立方体集中，所以算法的答案`"YES"`。 
相反，每当算法发现$x-a^3$属于立方体集合，存在正整数$b$其立方等于余数。 等式$x=a^3+b^3$然后很满意，所以回答`"YES"`是正确的。 
由于检查了每个可能的第一个多维数据集，并且成员资格测试准确地识别了预先计算的多维数据集，因此不会错过任何有效的表示，也不会接受无效的表示。 
## Python 解决方案```python
import sys
input = sys.stdin.readline
LIMIT = 10 ** 12
cubes = []
cube_set = set()
i = 1
while i ** 3 <= LIMIT:
    c = i ** 3
    cubes.append(c)
    cube_set.add(c)
    i += 1
t = int(input())
for _ in range(t):
    x = int(input())
    found = False
    for c in cubes:
        if c >= x:
            break
        if x - c in cube_set:
            found = True
            break
    print("YES" if found else "NO")
```第一部分预先计算所有立方体$10^{12}$。 它们只有 10,000 个，因此内存使用量和预处理时间都很短。 
哈希集是关键的数据结构。 没有它，检查是否$x-c$如果是立方体则需要再次搜索，从而使求解速度变慢。 
在每个测试用例中，我们迭代每个可能的第一个立方体。 对于每一项，我们计算达到目标所需的剩余金额$x$。 如果余数在立方集中，我们就找到了有效的分解。 
条件`if c >= x: break`是一个小小的优化。 一旦当前立方体至少$x$，所有后面的立方体都更大，因此余数将为零或负数。 由于两个整数都必须是正数，因此超出该点就不会出现任何解。 
Python 整数自动处理大于 32 位的值，因此即使立方体接近也不存在溢出问题$10^{12}$。 
## 工作示例
 ### 示例 1
 输入：```
35
```| 当前立方体$c$| 余$35-c$| 在立方体组中？ |
 | --- | --- | --- |
 | 1 | 34 | 34 没有 |
 | 8 | 27 | 27 是的 |
 算法达到$c=8=2^3$。 余数为 27，等于$3^3$。 由于 27 在立方体集中，所以答案是`"YES"`。 
此示例显示如何检查单个多维数据集自动确定唯一可能的合作伙伴多维数据集。 
### 示例 2
 输入：```
34
```| 当前立方体$c$| 余$34-c$| 在立方体组中？ |
 | --- | --- | --- |
 | 1 | 33 | 33 没有 |
 | 8 | 26 | 26 没有 |
 | 27 | 27 7 | 没有 |
 下一个立方体将是 64，超过 34，因此循环停止。 
立方体集合中没有发现余数，所以答案是`"NO"`。 
此示例演示了检查每个候选的第一个多维数据集，但没有一个生成另一个多维数据集作为余数。 
## 复杂度分析
 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(M)$每个测试用例| 迭代所有预先计算的立方体 |
 | 空间|$O(M)$| 存储立方体和哈希集 |
 这里$M \approx 10^4$， 因为$10000^3 = 10^{12}$。 
每个测试用例最多检查 10,000 个立方体值。 即使有 100 个测试用例，总工作量也只有大约 100 万次迭代，完全符合限制。 
## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline
    LIMIT = 10 ** 12
    cubes = []
    cube_set = set()
    i = 1
    while i ** 3 <= LIMIT:
        c = i ** 3
        cubes.append(c)
        cube_set.add(c)
        i += 1
    t = int(input())
    ans = []
    for _ in range(t):
        x = int(input())
        found = False
        for c in cubes:
            if c >= x:
                break
            if x - c in cube_set:
                found = True
                break
        ans.append("YES" if found else "NO")
    return "\n".join(ans) + "\n"
# provided sample
assert run(
"""7
1
2
4
34
35
16
703657519796
"""
) == """NO
YES
NO
NO
YES
YES
YES
"""
# minimum value
assert run(
"""1
1
"""
) == """NO
"""
# smallest valid representation
assert run(
"""1
2
"""
) == """YES
"""
# equal cubes
assert run(
"""1
16
"""
) == """YES
"""
# large boundary cube sum
assert run(
"""1
2000000000000
"""
) == """YES
"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1`|`NO`| 最小可能值 |
 |`2`|`YES`| 最小有效分解|
 |`16`|`YES`| 两个立方体相等的情况 |
 |`2000000000000`|`YES`| 立方根边界附近的大值 |
 ## 边缘情况
 考虑输入：```
1
1
```该算法从最小的立方体开始，$1$。 自从$1 \ge x$，循环立即停止。 不存在有效的对，因为两个立方体都必须为正。 输出是`"NO"`。 
考虑输入：```
1
2
```第一个立方体是$1$。 余数为$2-1=1$。 由于 1 存在于立方体集中，该算法找到表示$1^3+1^3$和输出`"YES"`。 
考虑输入：```
1
16
```算法检查$1$， 然后$8$。 为了$c=8$，余数也是$8$。 因为立方体集合包含8，所以算法接受分解$2^3+2^3$。 这证实了相同的立方体是自然处理的。 
考虑输入：```
1
34
```该算法检查每个可能小于 34 的第一个立方体。余数为 33、26 和 7，其中没有一个是立方体。 搜索结束，答案是`"NO"`。 这验证了该算法不会错误地接受接近有效立方和但实际上无法表示的数字。
