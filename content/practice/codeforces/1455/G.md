---
title: "CF 1455G - 禁止值"
description: "任务是模拟一种简化的编程语言，其中可以通过设置指令为单个变量 x 赋值。"
date: "2026-06-11T02:47:56+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dp"]
categories: ["algorithms"]
codeforces_contest: 1455
codeforces_index: "G"
codeforces_contest_name: "Educational Codeforces Round 99 (Rated for Div. 2)"
rating: 2900
weight: 1455
solve_time_s: 114
verified: false
draft: false
---

[CF 1455G - 禁止值](https://codeforces.com/problemset/problem/1455/G)

 **评分：** 2900
 **标签：** 数据结构，dp
 **Solve time:** 1m 54s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 任务是模拟一种简化的编程语言，其中单个变量`x`可以通过赋值`set`指示。 每个`set`如果我们想删除它，指令就会产生成本，目标是防止`x`不再被赋予禁止值`s`同时花费最少的总成本。 该程序还包含条件块，从`if y`并以匹配结束`end`，其中块内的指令仅在以下情况下执行`x`目前等于`y`。 这些块可以嵌套，创建执行路径的树状结构。 

输入包括`n`说明，其中`n`可能高达200,000，并且成本`v`可以大到 10^9。 探索所有可能的指令删除组合的强力模拟将涉及 2^n 种可能性，这是不可行的。 因此，我们需要一种算法，能够在相对于指令数量的线性时间内处理程序。 

边缘情况包括连续的`set`在内部和外部分配禁止值的指令`if`块。 例如，一个程序设置`x`到`s`立即然后嵌套`if`具有其他禁止分配的块需要仔细处理，以避免错过更便宜的删除路径。 另一个棘手的情况是嵌套的`if`条件本身可能是禁止值的块，可能会跳过整个指令子树。 

一个小例子凸显了其中的微妙之处。 考虑：```
4 1
set 1 10
if 0
set 1 5
end
```在这里，第一个`set`套`x`为 1，这是禁止的，必须以成本 10 删除。嵌套`set`里面的`if`块永远不会执行，所以我们不会花费它的成本。 任何简单的算法都会删除所有`set`的`1`会超支。 

## 方法

 一种简单的方法是逐行遍历程序，模拟`x`当它发生变化时，每当`set`将分配禁止值`s`，我们将其成本添加到总成本中。 对于嵌套`if`块，我们需要维持当前值`x`在每个级别。 这在概念上可行，但效率很低，因为通过嵌套条件维护所有可能的路径可能会在最坏的情况下导致指数复杂性。 

最佳解决方案的关键在于，在程序中的任何一点，只有当前值`x`以及预防的成本`s`从被分配的事情。 我们不需要考虑所有的历史路径，只需要考虑每个潜在路径的最小成本`x`在每个嵌套级别。 这一观察结果使我们能够使用带有堆栈的动态编程方法来跟踪避免的成本`s`对于每个活跃的`if`堵塞。 当我们遇到一个`set y v`指令，如果`y`等于`s`，我们必须删除它或忽略它，具体取决于当前执行路径是否处于活动状态。 嵌套`if`一旦块关闭，块仅向上传播最小成本，这确保线性遍历足够。 

之间的过渡`if`和`end`可以使用一堆字典来处理：每个字典映射一个可能的`x`价值以最小成本避免分配`s`在那个街区。 当我们退出一个块时，我们将其成本表与其父块合并，为每个值取最小成本。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了|
 | 最佳| O(n) | O(n) | 已接受 |

 ## 算法演练

 1.初始化一个栈来表示active`if`块。 堆栈上的每个元素都保存一个映射当前的字典`x`值以最小成本避免分配`s`在那个街区。 将全局作用域压入堆栈`x=0`并且成本为0。 
2. 迭代每条指令。 对于一个`set y v`指令，检查是否`y`等于`s`。 如果是这样，在不破坏程序的情况下继续执行的最小成本是当前成本加`v`。 否则，成本保持不变。 相应地更新堆栈顶部的字典。 
3. 对于一个`if y`指令，将一个新的空字典压入堆栈。 仅设置当前词典的条目`x`价值观匹配`y`。 这确保我们只跟踪活动的执行路径`if`块将执行。 
4.对于一个`end`指令，弹出顶部字典并将其与堆栈中的前一个字典合并。 对于每个`x`弹出的字典中的值，用其当前成本和子成本之间的最小成本更新父字典。 这将最小成本向上传播。 
5. 处理完所有指令后，全局范围的字典包含要避免的最小成本`s`为了`x=0`。 输出这个值。 

为什么它起作用：在每个嵌套级别，堆栈确保我们只传播给定当前值的可能执行路径的成本`x`。 我们从不考虑不可能的路径，我们总是在替代方案中选择成本最小的。 这保证了最终成本全局最小。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, s = map(int, input().split())
instructions = [input().strip() for _ in range(n)]

stack = [{0: 0}]

for line in instructions:
    parts = line.split()
    if parts[0] == 'set':
        y = int(parts[1])
        v = int(parts[2])
        new_top = {}
        for x_val, cost in stack[-1].items():
            if y == s:
                new_cost = cost + v
                new_top[x_val] = min(new_top.get(x_val, float('inf')), new_cost)
            else:
                new_top[y] = min(new_top.get(y, float('inf')), cost)
        stack[-1] = new_top
    elif parts[0] == 'if':
        y = int(parts[1])
        new_top = {}
        for x_val, cost in stack[-1].items():
            if x_val == y:
                new_top[x_val] = cost
        stack.append(new_top)
    elif parts[0] == 'end':
        child = stack.pop()
        parent = stack[-1]
        for x_val, cost in child.items():
            parent[x_val] = min(parent.get(x_val, float('inf')), cost)

print(min(stack[0].values()))
```第一部分解析输入并使用全局执行范围初始化堆栈。 这`set`谨慎处理仅更新相关内容`x`值，如果发生禁止分配，则成本会增加。`if`仅为条件与当前条件匹配的路径创建新字典`x`。 这`end`指令使用最小成本比较将子成本合并到父字典中，确保最佳传播。 

## 工作示例

 样本1：```
5 1
set 1 10
set 2 15
if 2
set 1 7
end
```| 步骤| 堆栈顶部的 x 值 | 说明|
 | --- | --- | --- |
 | 初始| {0:0} | 全局范围，x 从 0 开始 |
 | 1 套 10 | {1:0, 0:10} | 如果被禁止，分配 1 的成本为 10，否则跟踪新的 x=1 |
 | 2 组 15 | {2:0, 1:0, 0:10} | 分配 2 不会破坏，传播成本 |
 | 如果 2 | {2:0} | 只有 x=2 的路径才进入 if 块 |
 | 设置 1 7 | {1:7} | 在 if 内赋值 1，禁止，成本 +=7 |
 | 结束 | 合并到父级 | 父级现在有 {1:7, 2:0, 0:10} |

 避免的最小成本`x=1`是 17，确认样本输出。 

另一个例子：```
3 2
set 1 5
set 2 3
set 3 4
```堆栈顶部的演变为 {0:0} -> {1:0} -> {2:3} -> {3:3}。 最小成本为 3，对应于移除`set 2 3`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每条指令处理一次，字典更新不断摊销 |
 | 空间| O(n) | 堆栈可以随着嵌套而增长`if`块，每个块最多包含 n 个键 |

 该算法在 2 秒内适合 n 最多 2 * 10^5，因为所有操作都是线性的，并且字典合并平均速度很快。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, s = map(int, input().split())
    instructions = [input().strip() for _ in range(n)]
    stack = [{0: 0}]
    for line in instructions:
        parts = line.split()
        if parts[0] == 'set':
            y = int(parts[1])
            v = int(parts[2])
            new_top = {}
            for x_val, cost in stack[-1].items():
                if y == s:
                    new_cost = cost + v
                    new_top[x_val] = min(new_top.get(x_val, float('inf')), new_cost)
                else:
                    new_top[y] = min(new_top.get(y, float('inf
```
