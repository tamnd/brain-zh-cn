---
title: "CF 102536I - 阿尔戈茨卡的荣耀"
description: "公司的层次结构是一棵有根的树。 员工 i 是调查区域的根，有效报告是包含 i 的任何连接的员工集。"
date: "2026-08-06T20:29:57+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102536
codeforces_index: "I"
codeforces_contest_name: "2020 UP ACM Algolympics Final Round"
rating: 0
weight: 102536
solve_time_s: 88
verified: true
draft: false
---

[CF 102536I - 荣耀属于阿尔戈茨卡](https://codeforces.com/problemset/problem/102536/I)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 28s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 公司的层次结构是一棵有根的树。 员工`i`是调查区域的根，有效报告是包含以下内容的任何连接的员工集`i`。 因为结构是一棵树，这意味着每当我们包含后代时，返回路径上的每个员工`i`也必须包括在内。 

每个员工都有两种类型之一。 查询询问子树内是否存在某些有效的连通集`i`恰好包含`c`员工类型`C`确切地说`s`员工类型`S`。 

输入顺序有一个有用的属性：每个父级都出现在其子级之前。 这允许以相反的索引顺序执行动态编程。 极限是不对称的：只有`10000`员工，但最多`200000`查询。 需要一个为每个查询探索树的解决方案`2 * 10^9`最坏情况下的节点访问，远远超出时间限制。 预处理阶段必须完成几乎所有工作，使每个查询的时间接近恒定。 

一个常见的错误是只存储可能的子树大小。 这会丢失信息，因为两个具有相同大小的连通集可能包含不同数量的`C`雇员。 

例如，考虑：```
2 1
0 1
CS
1 1 1
```答案是`COMPROMISED`因为选择这两名员工会给一个人`C`和一个`S`。 仅存储可能尺寸的解决方案会知道该尺寸`2`是可能的，但它不知道分布。 

另一个边缘情况是要求计数大于子树大小的查询。```
1 2
0
C
1 0 1
1 2 0
```第一个查询是`COMPROMISED`，因为单个节点是社会主义计数为零，资本主义计数为一。 第二个查询是`NOT COMPROMISED`，因为没有足够的员工。 任何忘记检查数组边界的实现都可能错误地访问无效状态。 

## 方法

 直接的解决方案是为每个查询枚举每个连接的有根子树。 这是正确的，因为每个可能的答案都会被检查，但连接的子树的数量可能是指数级的。 哪怕是一段漫长的路`10000`已经有平方数量的有根连接选择，并且这样做是为了`200000`查询是不可能的。 

第一个改进是对每个节点进行预处理。 对于一个节点`v`，不是存储每个可能的连接子树，而是存储每个可能大小的信息`t`。 在所有连通的大小集合中`t`植根于`v`，我们只需要最小和最大可能的数量`C`雇员。 关键的观察是这两个极端之间的每个值也是可能的。 

如果最小数量为`C`员工是`a`最大值是`b`，通过一次替换一个选定的节点将最小构造转换为最大构造，每次最多改变计数 1。 该序列必须遍历来自的每个值`a`到`b`。 

因此动态规划状态为：`minC[v][t]`= 最小数量`C`有效连接组中的员工`t`根节点为`v`。`maxC[v][t]`定义类似。 

当组合孩子时，我们像树背包一样合并他们可能的贡献。 总的合并工作是二次的而不是三次的，因为一对节点仅在处理它们的最低公共祖先时才被组合。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个查询呈指数 | O(n) | 太慢了 |
 | 最佳DP | O(n²) 预处理，O(1) 查询 | O(n²) | 已接受 |

 ## 算法演练

 1. 处理节点来自`n`下降到`1`。 因为父母的索引总是比孩子小，所以每个孩子都已经被处理过。 
2.用节点本身初始化节点的动态编程状态。 如果节点是`C`，一个大小相连的集合有一个资本家。 如果是的话`S`，该值为零。 
3. 将每个子节点合并到当前节点。 对于已获取的每个可能的节点数量以及从子子树中获取的每个可能的数量，更新最小和最大资本家计数。 
4. 存储每个节点的结果数组。 查询`(i, c, s)`询问一组连通的大小`c+s`。 如果`c`位于之间`minC[i][c+s]`和`maxC[i][c+s]`，答案是`COMPROMISED`。 

其原理：DP 为每种可能的规模存储了尽可能多的资本家。 间隔属性证明这些极值之间没有缺失值。 查询条件精确检查所请求的资本家数量是否属于该区间，而总规模自动确定社会主义者的数量。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    n, q = map(int, input().split())
    parent = list(map(int, input().split()))
    s = input().strip()

    children = [[] for _ in range(n)]
    for i in range(1, n):
        children[parent[i] - 1].append(i)

    INF = 30000
    mins = [None] * n
    maxs = [None] * n

    for v in range(n - 1, -1, -1):
        val = 1 if s[v] == 'C' else 0

        if len(children[v]) == 0:
            mins[v] = array('h', [INF, val])
            maxs[v] = array('h', [-INF, val])
            continue

        if len(children[v]) == 1:
            ch = children[v][0]
            cm = mins[ch]
            cx = maxs[ch]
            mn = array('h', [INF] * (len(cm) + 1))
            mx = array('h', [-INF] * (len(cx) + 1))
            mn[1] = val
            mx[1] = val
            for t in range(1, len(cm)):
                mn[t + 1] = cm[t] + val
                mx[t + 1] = cx[t] + val
            mins[v] = mn
            maxs[v] = mx
            continue

        cur_min = array('h', [INF, val])
        cur_max = array('h', [-INF, val])

        for ch in children[v]:
            cm = mins[ch]
            cx = maxs[ch]
            a = len(cur_min) - 1
            b = len(cm) - 1
            nm = array('h', [INF] * (a + b + 1))
            nx = array('h', [-INF] * (a + b + 1))

            for i in range(1, a + 1):
                if cur_min[i] < nm[i]:
                    nm[i] = cur_min[i]
                if cur_max[i] > nx[i]:
                    nx[i] = cur_max[i]

            for i in range(1, a + 1):
                if cur_min[i] == INF:
                    continue
                for j in range(1, b + 1):
                    if cm[j] != INF:
                        x = cur_min[i] + cm[j]
                        if x < nm[i + j]:
                            nm[i + j] = x
                    if cx[j] != -INF:
                        x = cur_max[i] + cx[j]
                        if x > nx[i + j]:
                            nx[i + j] = x

            cur_min, cur_max = nm, nx

        for i in range(1, len(cur_min)):
            cur_min[i] += val
            cur_max[i] += val

        mins[v] = cur_min
        maxs[v] = cur_max

    out = []
    for _ in range(q):
        i, c, st = map(int, input().split())
        i -= 1
        size = c + st
        if size < len(mins[i]) and mins[i][size] <= c <= maxs[i][size]:
            out.append("COMPROMISED")
        else:
            out.append("NOT COMPROMISED")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```反向迭代避免了递归深度问题，因为输入排序已经给出了有效的自下而上的顺序。 每个存储的数组对于每个可能的连接集大小都有一个条目。 这`array('h')`容器保持较低的内存使用量，因为每个存储的值最多`10000`。 

单子优化是必要的。 如果没有它，路径形树将反复合并一个大的子状态并退化为立方体工作。 通过优化，昂贵的背包合并仅发生在分支节点处，其中整个树上的成对交互总量仍然是二次的。 

查询使用`size = c + s`因为每个被选中的员工要么是`C`或者`S`。 一旦规模和资本主义数量确定，社会主义数量就确定了。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n² + q) | 树背包预处理加常数时间查询 |
 | 空间| O(n²) | 存储每个节点的所有 DP 间隔 |

 子树大小的最大可能总和约为`n²/2`，对于一条链来说大约有 5000 万个状态。 紧凑的整数数组将其保持在充足的内存限制内。 

## 工作示例

 对于样本：```
5 3
0 1 2 3 4
CSCSC
1 3 2
1 2 2
2 2 1
```树是一条链：```
1(C)
 |
2(S)
 |
3(C)
 |
4(S)
 |
5(C)
```根状态包括：

 | 节点| 尺寸| 最低 C | 最大C |
 | --- | --- | --- | --- |
 | 1 | 1 | 1 | 1 |
 | 1 | 2 | 1 | 1 |
 | 1 | 3 | 2 | 2 |
 | 1 | 4 | 2 | 2 |
 | 1 | 5 | 3 | 3 |

 第一个查询询问尺寸`5`和`3`资本家，这是在区间之内的，所以它是可以接受的。 

第三个查询询问节点`2`和`3`员工总数和`2`资本家。 可能的链从节点`2`有员工`2,3,4,5`，并且在尺寸三的选择中，资本主义计数不能达到二，因此被拒绝。 

## 测试用例```
# The solution above can be tested with the following inputs.

sample = """5 3
0 1 2 3 4
CSCSC
1 3 2
1 2 2
2 2 1
"""

case1 = """1 2
0
C
1 1 0
1 0 1
"""

case2 = """3 3
0 1 1
SSS
1 0 3
2 0 2
2 1 1
"""

case3 = """4 3
0 1 1 2
CCCC
1 4 0
1 2 2
2 1 1
"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单节点|`COMPROMISED`,`NOT COMPROMISED`| 最小树和无效计数 |
 | 全部`S`节点 | 仅限社会主义的有效范围 | 所有相同的值 |
 | 全部`C`节点 | 资本主义的边界| 正确的尺寸处理 |

 ## 边缘情况

 通过仅初始化大小一个状态来处理单个员工树。 不会发生子合并，因此答案仅取决于员工自己的类型。 

对于长链，单子级转换会通过大小偏移复制子级的状态。 这避免了昂贵的嵌套合并并保持运行时间的平方。 

对于分支树，合并步骤保持两个极端。 接受请求中间值的查询，因为间隔属性涵盖了两个极端之间的所有可能的资本家计数。
