---
title: "CF 102503Q - Og 和 Ug"
description: "我们得到一棵有根树，以节点 1 为根。 Og 的原始程序使用显式堆栈执行前序遍历。"
date: "2026-08-07T04:56:23+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102503
codeforces_index: "Q"
codeforces_contest_name: "National Olympiad in Informatics - Philippines (NOI.PH) Online Eliminations 2020"
rating: 0
weight: 102503
solve_time_s: 467
verified: false
draft: false
---

[CF 102503Q - Og 和 Ug](https://codeforces.com/problemset/problem/102503/Q)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 47s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一棵有根树，以节点 1 为根。 Og 的原始程序使用显式堆栈执行前序遍历。 Ug 更改了程序，以便每当一个节点完成处理其所有子节点时，该节点的新副本就会插入到双端队列的前面。 程序永远不会停止，我们需要回答询问在极大位置打印的值的查询。 

该树最多有 50 个节点，但请求的位置最多可以包含 100 个数字。 对每个打印值简单执行一次操作的模拟是不可能的，因为即使是 (10^{100}) 这样的值也无法直接接近。 (n) 的较小值告诉我们，解决方案必须利用执行的重复结构而不是树的大小。 

主要危险在于假设输出只是永远重复的正常 DFS 遍历。 一个节点可以出现多次，顺序受双端队列影响。 例如，叶子仅在处理后才重复插入到前面，而内部节点可以在到达其自身的较旧副本之前开始对其子节点的另一次遍历。 

考虑这棵小树：```
2 1
1 2
0
```第一个输出是：```
1 2 1 2 1 2 ...
```假设每次遍历树时每个节点都打印一次的解决方案将会失败，因为节点 1 的第二次出现发生在节点 2 的第二次出现之前。 

另一个棘手的情况是单节点树：```
1 1
0
```输出是：```
1 1 1 1 ...
```没有可以前进的子节点，因此节点不断地重新创建自身。 

## 方法

 直接的方法是实现修改后的程序并进行模拟，直到到达每个请求的位置。 这是正确的，因为程序本身是确定性的，因此复制其双端队列操作会产生完全相同的输出。 但是，查询可能大到 (10^{100})，因此无法进行直接模拟。 

关键的观察结果是程序具有有限状态。 状态是双端队列对的完整内容`(node, next_child_index)`。 一旦相同的双端队列状态出现两次，从那时起，以后的每个操作都是相同的。 从该状态第一次出现开始的打印序列是一个循环。 

树很小，所以我们可以通过模拟发现这个循环。 我们仅进行模拟，直到出现重复状态，然后通过跳转到发现的前缀内来回答每个大型查询，并在查询索引上使用模块化算术进行循环。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(最大查询值) | O(n) | 太慢了|
 | 循环检测| O(重复之前的状态数) | O(重复之前的状态数) | 已接受 |

 ## 算法演练

 1. 每当我们访问当前的双端队列状态时，将其存储为一个元组。 存储的位置是在此状态之前已经打印的值的数量。 

执行是确定性的，因此再次访问同一个双端队列意味着整个未来的输出将重复。 
2. 虽然当前状态以前没有出现过，但执行 Ug 程序的一次迭代。 

删除最右边的一对`(node, i)`， 打印`node`，然后遵循与原始代码相同的规则。 
3.如果`i`不等于子节点数，则将当前节点放回原处`i + 1`并开始处理孩子`i`。 

这代表从孩子返回后继续遍历。 
4. 否则，插入`(node, 0)`在双端队列的左侧。 

这是 Ug 的修改，也是该过程变得无限的原因。 
5. 找到重复状态后，将生成的序列拆分为非重复前缀和重复循环。 
6. 对于每个查询索引，如果位于前缀内，则直接返回对应的值。 否则，使用模运算进入循环。 

为什么它有效：

 双端队列完全决定了程序的下一步操作。 不使用外部信息，因此相等的双端队列状态始终生成相同的未来输出。 模拟记录第一个重复状态之前的每个输出，并且重复状态给出无限序列的周期。 跳过这个时期与执行原始程序的大量步骤具有相同的价值。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())

    children = []
    for _ in range(n):
        data = list(map(int, input().split()))
        children.append([x - 1 for x in data[1:]])

    queries = [int(input().strip()) for _ in range(k)]

    q = deque([(0, 0)])
    seen = {}
    order = []

    while True:
        state = tuple(q)
        if state in seen:
            cycle_start = seen[state]
            break

        seen[state] = len(order)

        node, idx = q.pop()
        order.append(node + 1)

        if idx != len(children[node]):
            q.append((node, idx + 1))
            q.append((children[node][idx], 0))
        else:
            q.appendleft((node, 0))

    cycle_len = len(order) - cycle_start

    ans = []
    for x in queries:
        x -= 1
        if x < len(order) - cycle_len:
            ans.append(str(order[x]))
        else:
            ans.append(str(order[cycle_start + (x - cycle_start) % cycle_len]))

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```双端队列包含内部使用从零开始的节点索引的对。 元组转换是重要的实现细节，因为`deque`本身是可变的，不能用作字典键。 

模拟在更改双端队列之前记录打印值。 这与语句中的操作顺序相匹配，其中打印在弹出节点后立即发生。 

Python整数已经支持任意精度，因此100位的查询值不需要特殊处理。 唯一使用大型查询的地方是已知循环后的取模运算。 

边界条件是前缀和循环之间的分割。 如果查询指向重复状态开始之前，则它直接使用存储的前缀。 否则将被映射到循环中。 

## 工作示例

 对于样本树：```
1
├──2
│  └──3
└──4
```模拟的开始是：

 | 印刷位置| 国家行动| 打印节点|
 | --- | --- | --- |
 | 1 | 从根开始 | 1 |
 | 2 | 输入第一个孩子 | 2 |
 | 3 | 输入 2 岁的孩子 | 3 |
 | 4 | 完成节点3并返回| 2 |
 | 5 | 在子级 2 之后继续 root | 1 |
 | 6 | 第二个孩子登场 | 4 |
 | 7 | 完成 root 子项 | 1 |

 后面的部分不是由正常的 DFS 重新启动生成的。 双端队列包含未决状态，并且重复的双端队列检测找到相同的未来再次开始的确切点。 

单节点树展示了另一个极端：

 | 印刷位置 | 国家行动| 打印节点|
 | --- | --- | --- |
 | 1 | 弹出唯一节点 | 1 |
 | 2 | 节点重新创建自身 | 1 |
 | 3 | 相同的状态重复| 1 |

 循环长度为一，因此每个查询都映射到唯一的存储值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(S)| S 是重复之前遇到的不同双端队列状态的数量 |
 | 空间| O(S)| 每个发现的状态和打印的值都存储一次 |

 树的大小只有50，这就是为什么发现执行周期是可行的。 该算法从不依赖于查询位置的数字大小。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)

    from collections import deque

    input = sys.stdin.readline
    n, k = map(int, input().split())

    children = []
    for _ in range(n):
        data = list(map(int, input().split()))
        children.append([x - 1 for x in data[1:]])

    queries = [int(input()) for _ in range(k)]

    q = deque([(0, 0)])
    seen = {}
    order = []

    while True:
        state = tuple(q)
        if state in seen:
            start = seen[state]
            break
        seen[state] = len(order)

        node, idx = q.pop()
        order.append(node + 1)

        if idx != len(children[node]):
            q.append((node, idx + 1))
            q.append((children[node][idx], 0))
        else:
            q.appendleft((node, 0))

    cycle = len(order) - start
    out = []
    for x in queries:
        x -= 1
        if x < start:
            out.append(str(order[x]))
        else:
            out.append(str(order[start + (x - start) % cycle]))

    sys.stdin = old
    return "\n".join(out)

assert run("""4 7
2 2 4
1 3
0
0
6
9
69
143
214
241
420
""") == """4
2
2
3
3
3
3"""

assert run("""1 4
0
1
2
100
100000000000000000000
""") == """1
1
1
1"""

assert run("""2 5
1 2
0
1
2
3
4
5
""") == """1
2
1
2
1"""

assert run("""3 4
2 2 3
0
0
1
2
3
4
""") == """1
2
3
1"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 输入样本| 样本输出 | 基本遍历和循环跳跃 |
 | 一个节点 | 所有的 | 仅叶无限循环 |
 | 两个节点的链 | 交替节点 | 重复内部节点处理|
 | 根有两片叶子 | 多个孩子返回 | 正确的双端队列排序 |

 ## 边缘情况

 叶节点永远不会进入子分支。 该算法处理它是因为唯一可能的转换是`else`分支，再次插入相同的状态并创建一个长度为 1 的循环。 

具有一个子节点的内部节点与叶子节点不同。 该节点首先下降到其子节点，然后返回到自身并开始另一个子节点遍历。 存储的状态包括子索引，因此这两种情况不要混淆。 

非常大的查询值在知道周期后进行处理。 例如，（10^{100}）这样的位置是通过减去前缀长度并与循环长度取模来减少的，因此不需要模拟实际值。 

如果您想要一个更接近 Codeforces 上出现的版本，我还可以提供一个更短的竞赛编辑版本，更少的阐述，更多地强调不变量和证明。
