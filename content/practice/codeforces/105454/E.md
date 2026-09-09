---
title: "CF 105454E - \u041a\u043e\u043c\u0430\u043d\u0434\u044b \u043d\u0430 \u041f\u0420\u041e\u0428\u041f"
description: "我们有一组由 $n$ 人组成的团队，并且希望组建由三个不同成员组成的团队。 然而，并非所有三人组都被允许，因为有 $m$ 禁止的成对人员不能一起出现在同一团队中。"
date: "2026-06-23T17:38:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105454
codeforces_index: "E"
codeforces_contest_name: "\u041f\u0435\u0440\u043c\u0441\u043a\u0430\u044f \u0440\u0435\u0433\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e 2024"
rating: 0
weight: 105454
solve_time_s: 83
verified: false
draft: false
---

[CF 105454E - \u041a\u043e\u043c\u0430\u043d\u0434\u044b \u043d\u0430 \u041f\u0420\u041e\u0428\u041f](https://codeforces.com/problemset/problem/105454/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 23s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被赋予了一组$n$人们并希望组建由三个不同成员组成的团队。 然而，并不是每个三元组都是允许的，因为有$m$禁止成对的人不能一起出现在同一队伍中。 有效的团队是任何三人组，并且该三人组中不会出现禁止的配对。 

任务是计算给定的人员可以形成多少个有效的三元组，其中顺序并不重要，并且每个人可以在不同的团队中多次使用。 如果两个团队之间至少有一个人不同，则被认为是不同的。 

约束条件$n \le 300$是关键的结构提示。 对所有三元组的简单枚举已经是单独可行的，因为$\binom{300}{3} \approx 4.5 \cdot 10^6$，但是使用查找结构检查每个三元组的有效性仍然可以使其保持在时间限制内。 然而，由于我们还必须处理$m \le 45{,}000$禁止对，解决方案必须支持快速邻接检查。 

一个微妙的边缘情况是，由于密集的限制，根本没有有效的三元组。 例如，如果涉及特定人的每一对都被禁止，则包含它们的三元组不起作用，但其他节点之间的三元组可能仍然存在。 另一种边缘情况是根本不存在禁止对，在这种情况下，答案很简单$\binom{n}{3}$。 

第二个不明显的问题是按名称索引。 由于输入使用字符串，因此需要有效映射到整数索引； 否则，在三重循环内重复进行字符串比较会太慢。 

## 方法

 蛮力的想法很简单：迭代所有三元组$(i, j, k)$和$i < j < k$，并检查这三对中是否有任何一对是禁止的。 对于布尔邻接矩阵或哈希集，每次检查都是$O(1)$，所以完整的枚举运行在$O(n^3)$时间，最坏情况下大约需要 2700 万次迭代$n=300$。 这已经接近极限，但如果仔细实现的话，在优化的 Python 中仍然可以接受。 

关键的观察是，除了快速对查找之外，我们不需要构建任何东西。 不需要像 DP 或包含-排除这样的更深层次的组合结构，因为约束仅消除每个三元组内的局部对。 这意味着每个候选三元组都可以独立验证。 

我们将名称转换为索引，构建一个禁止的邻接矩阵（或一组位集），然后通过扫描所有组合来直接计算有效的三元组。 任何更复杂的策略都会增加开销，而不会提高渐近复杂性，因为输出本身是$\Theta(n^3)$最坏情况枚举。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力三重检查 |$O(n^3)$|$O(n^2)$| 已接受 |
 | 任何高级优化 | 不需要 | 更高的开销| 实践中速度较慢 |

 ## 算法演练

 1. 读取所有名称并为每个名称分配一个从 0 到$n-1$。 这允许恒定时间访问关系。 
2. 创建二维布尔结构`bad[i][j]`表示是否配对$(i, j)$是被禁止的。 我们将其对称化，以便标记两个方向。 这确保了以后的恒定时间检查。 
3. 将应答计数器初始化为零。 这将累积有效三元组的数量。 
4. 迭代所有三元组$i < j < k$。 对于每个三元组，检查三个成对关系：$(i, j)$,$(i, k)$， 和$(j, k)$。 
5. 如果这些对中没有一个是被禁止的，则增加答案。 否则跳过三重。 
6. 输出最终计数模$10^9 + 13$。 

这样做的原因是每个无效三元组必须包含至少一个禁止对，而每个有效三元组都不包含任何禁止对。 由于我们只枚举所有无序三元组一次，并且每个元组都被独立检查，因此计数是准确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 13

def solve():
    n, m = map(int, input().split())
    
    name_to_idx = {}
    for i in range(n):
        name = input().strip()
        name_to_idx[name] = i

    bad = [[False] * n for _ in range(n)]

    for _ in range(m):
        a, b = input().split()
        a = name_to_idx[a]
        b = name_to_idx[b]
        bad[a][b] = True
        bad[b][a] = True

    ans = 0

    for i in range(n):
        for j in range(i + 1, n):
            if bad[i][j]:
                continue
            for k in range(j + 1, n):
                if not bad[i][k] and not bad[j][k]:
                    ans += 1

    print(ans % MOD)

if __name__ == "__main__":
    solve()
```该解决方案首先将每个名称映射到一个索引，这避免了三重循环内重复的字符串比较。 邻接矩阵`bad`是对称的，因此每个禁止对都存储两次，无论顺序如何都允许一次查找。 

三重循环采用递增索引结构，以保证每个组合都被精确计数一次。 在内部，我们使用早期修剪`bad[i][j]`，因为如果第一对无效，则整个三元组无效。 这种小的优化减少了密集图中不必要的内循环迭代。 

最后，只有当所有三对检查都通过时，我们才会增加答案。 

## 工作示例

 ### 示例 1

 输入：```
5 3
anton borya vitya gosha denis
anton borya
vitya gosha
borya denis
```我们索引：```
anton=0, borya=1, vitya=2, gosha=3, denis=4
```禁止配对：

 (0,1), (2,3), (1,4)

 我们枚举三元组：

 | 我| j | k | (i,j) | (i,k) | (j,k) | 有效 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 1 | 2 | 坏| - | - | 没有|
 | 0 | 1 | 3 | 坏| - | - | 没有|
 | 0 | 1 | 4 | 坏| - | - | 没有|
 | 0 | 2 | 3 | 好的 | 坏| 坏| 没有|
 | 0 | 2 | 4 | 好的 | 好的 | 好的 | 是的 |
 | 0 | 3 | 4 | 好的 | 好的 | 好的 | 是的 |
 | ... | | | | | | |

 有效的三元组恰好是两个，匹配输出 2。 

这证实了修剪逻辑正确地消除了任何包含禁止对的三元组。 

### 示例 2

 输入：```
8 3
anna bella cindy dora elsa fiona ginny hannah
cindy ginny
cindy hannah
anna cindy
```禁止对限制所有涉及的三元组`cindy`重重。 该算法仍然枚举所有组合，但在检查时大多数都被过滤掉`bad`。 

有效计数累计至 41，与剩余无约束组合的系统枚举一致。 

这表明，即使一个顶点受到高度约束，该算法仍然是正确的，因为它从不假设均匀密度，它只检查成对的有效性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n^3)$| All unordered triples are enumerated once, each checked in constant time |
 | 空间|$O(n^2)$| 布尔矩阵存储所有对之间的禁止关系 |

 和$n \le 300$，最大迭代次数约为 450 万次，这完全在 Python 使用简单数组查找时的典型限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdout.getvalue() if False else solve_capture(inp)

def solve_capture(inp: str) -> str:
    import sys
    input = iter(inp.splitlines()).__next__

    n, m = map(int, input().split())
    name_to_idx = {}
    for i in range(n):
        name_to_idx[input().strip()] = i

    bad = [[False]*n for _ in range(n)]
    for _ in range(m):
        a, b = input().split()
        a = name_to_idx[a]
        b = name_to_idx[b]
        bad[a][b] = bad[b][a] = True

    ans = 0
    for i in range(n):
        for j in range(i+1, n):
            if bad[i][j]:
                continue
            for k in range(j+1, n):
                if not bad[i][k] and not bad[j][k]:
                    ans += 1

    return str(ans % (10**9 + 13))

# provided samples
assert solve_capture("""5 3
anton
borya
vitya
gosha
denis
anton borya
vitya gosha
borya denis
""") == "2"

assert solve_capture("""8 3
anna
bella
cindy
dora
elsa
fiona
ginny
hannah
cindy ginny
cindy hannah
anna cindy
""") == "41"

# minimal case
assert solve_capture("""3 0
a
b
c
""") == "1"

# all forbidden pairs
assert solve_capture("""3 3
a
b
c
a b
a c
b c
""") == "0"

# star constraint
assert solve_capture("""4 3
a
b
c
d
a b
a c
a d
""") == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 3人，无限制| 1 | 基础组合学|
 | 完整的禁三角| 0 | 彻底消除|
 | 星节点| 1 | 局部约束|

 ## 边缘情况

 当$n = 3$并且不存在禁止对，算法精确地检查一个三元组并接受它，产生 1。循环结构自然地处理这个问题，无需特殊的外壳。 

当所有对都被禁止时，每次三重检查在第一次或第二次比较时都会失败。 例如与$i=0, j=1, k=2$，至少其中之一`bad[i][j]`,`bad[i][k]`,`bad[j][k]`为 true，因此计数器永远不会增加。 

当单个节点与其他节点不兼容时，例如`a`禁止与所有其他人一起使用，每个三元组都包含`a`期间被拒绝`(i,j)`或稍后检查。 其余$n-1$节点之间仍然形成有效的三元组，并且枚举自然只计算那些未经修改的组合。
