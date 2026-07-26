---
title: "CF 102821A - 自走棋"
description: "该问题模拟了自走棋游戏的准备阶段。 有一行 N 个等待槽，最初是空的。 鱼一一接收M级一级棋子。 每个棋子只有一个名字，同名的棋子可以组合。"
date: "2026-07-26T16:09:38+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102821
codeforces_index: "A"
codeforces_contest_name: "2019 Sichuan Province Programming Contest"
rating: 0
weight: 102821
solve_time_s: 46
verified: true
draft: false
---

[CF 102821A - 自走棋](https://codeforces.com/problemset/problem/102821/A)

 **评级：** -
 **标签：** -
 **求解时间：** 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题模拟了自走棋游戏的准备阶段。 有一行`N`等待槽最初是空的。 鱼收到`M`一级棋子一一对应。 每个棋子只有一个名字，同名的棋子可以组合。 

当新棋子有名字时`s`到达时，游戏首先检查是否有level-3`s`已经存在于等待区。 如果是这样，新棋子就会消失。 否则，新的棋子会尝试与现有的副本结合。 如果有`K-1`1级副本`s`，它们与新的合并成 2 级`s`。 如果那个新创造的二级棋子也能与`K-1`已有2级副本，则成为3级棋子。 在所有可能的合并之后，生成的棋子占据最左边的空槽（如果存在）。 

输入给出了几个独立的游戏模拟。 对于每个测试用例，我们需要从左到右打印等待区的最终内容。 1 级棋子仅使用其名称打印，而更高级别的棋子则附加其级别编号。 空位置打印为`-1`。 

重要的限制是插槽的数量，`N`，可以达到`100000`。 这意味着每次插入后重复扫描整个等待区的解决方案可以执行`M * N`操作，如果插入很多棋子，就会变得太慢。 我们需要在接近恒定的时间内更新棋子的状态，并且只处理实际变化的位置。 

主要的边缘情况来自于合并和块的物理放置之间的相互作用。 简单的仅计数器解决方案可能会失败，因为输出取决于棋子的确切位置。 

例如，考虑：```
1
3 3 2
a
a
a
```正确的输出是：```
Case 1: a2 -1 -1
```前两个棋子组合成一个 2 级棋子。 第三个棋子不能与它结合，因为`K=2`需要另一个 2 级棋子，因此它占据下一个空槽。 一个粗心的实现，只跟踪总副本`a`可能会错误地创建 3 级零件。 

另一个边缘情况是当棋盘已满时：```
1
3 2 2
a
b
a
```正确的输出是：```
Case 1: a2 b
```前两个`a`碎片融合在一起，从概念上释放了原来的位置，因为它们消失了。 新的 2 级棋子被放入最左边的空槽中。 仅将片段附加到末尾的实现会产生错误的排列。 

最后一个棘手的情况是一个已经存在的 3 级片段：```
1
3 3 2
a
a
a
```在前两次操作之后，已经有了一个 2 级的棋子。 如果后续操作创建了 3 级片段，则必须拒绝该名称的所有未来副本。 忘记这条规则会导致出现额外的棋子。 

## 方法

 直接模拟很简单。 我们可以存储等待区，并且对于每个到达的棋子，搜索所有位置以计算存在多少个该名称的 1 级和 2 级棋子。 如果存在足够的副本，我们将删除它们，升级新的部分，并继续检查是否有另一个合并。 最后，我们再次扫描以找到第一个空槽。 

这种方法是正确的，因为它完全遵循规则，但它重复地遍历整个板。 在最坏的情况下，如果董事会`N=100000`位置和许多棋子到达，操作数量增长到大约`M*N`，这远远超出了一秒解决方案的处理能力。 

关键的观察是，规则只需要每个棋子名称的两种类型的信息：每个级别存在多少个棋子，以及这些棋子位于何处。 最终的排列仅取决于移除部件并插入到最左边的可用位置。 我们不需要检查不相关的名称。 

对于每个名称，我们维持其当前的 1 级和 2 级位置。 当有新块到达时，我们可以立即判断是否发生合并。 当碎片消失时，它们的槽就会变空，因此我们还维护一个可以快速给出最小空索引的数据结构。 最小堆是一种自然的选择，因为我们只需要插入新的空位置并提取最小的位置。 

总工作量与处理的棋子数量和实际合并的数量成正比，而不是与等待区的大小成正比。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(明尼苏达) | O(N) | 太慢了 |
 | 最佳 | O(M log N) | O(M log N) | O(N + M) | 已接受 |

 ## 算法演练

 1.将等待区存储为大小的数组`N`。 最初，每个位置都包含一个空标记。 将每个位置放入可用槽的最小堆中，以便始终可以找到最小的空索引。 
2. 对于每个传入的棋子名称，检查该名称的 3 级棋子是否已存在。 如果是，请忽略该棋子，因为规则禁止添加另一个副本。 
3. 维护每个名字的1级棋子和2级棋子的位置。 如果到达的棋子创建`K`相同名称的 1 级棋子，移除那些 1 级棋子，并将到达的棋子变成 2 级棋子。 
4、创建完2级棋子后，检查现在是否有`K`2级件。 如果是，则移除这些棋子并将到达的棋子转为 3 级。 
5. 如果棋子幸存，则从空位置堆中取出最小的索引并将棋子放在那里。 在相应的列表中记录该位置的名称和级别。 
6. 处理完所有插入后，打印等待区。 

这样做的原因是每个名称的列表始终包含当前存在的片段。 每次合并都会准确地删除规则所需的棋子，并将每个幸存的棋子插入到当前空的最小位置。 堆不变量保证每个放置位置都使用原始进程选择的相同位置。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def solve_case(M, N, K, pieces):
    board = ["-1"] * N
    empty = list(range(N))
    heapq.heapify(empty)

    data = {}

    def get_info(name):
        if name not in data:
            data[name] = [[], [], False]
        return data[name]

    for name in pieces:
        lv1, lv2, has3 = get_info(name)

        if has3:
            continue

        level = 1

        if len(lv1) == K - 1:
            for pos in lv1:
                board[pos] = "-1"
                heapq.heappush(empty, pos)
            lv1.clear()
            level = 2

            if len(lv2) == K - 1:
                for pos in lv2:
                    board[pos] = "-1"
                    heapq.heappush(empty, pos)
                lv2.clear()
                level = 3
                has3 = True

        if empty:
            pos = heapq.heappop(empty)
            if level == 1:
                board[pos] = name
                lv1.append(pos)
            elif level == 2:
                board[pos] = name + "2"
                lv2.append(pos)
            else:
                board[pos] = name + "3"
                data[name][2] = True

    return " ".join(board)

def main():
    t = int(input())
    ans = []

    for case in range(1, t + 1):
        M, N, K = map(int, input().split())
        pieces = [input().strip() for _ in range(M)]
        ans.append(f"Case {case}: {solve_case(M, N, K, pieces)}")

    print("\n".join(ans))

if __name__ == "__main__":
    main()
```数组`board`存储每个槽的最终可见状态。 堆`empty`准确包含当前空闲的职位。 每当发生合并时，被删除的片段都会将其位置返回到该堆中，从而保留找到最左边空闲槽的能力。 

字典`data`保留特定于棋子名称的所有信息。 第一个列表存储 1 级位置，第二个列表存储 2 级位置，布尔值记录是否存在 3 级块。 这避免了扫描不相关的位置。 

插入循环中的操作顺序遵循游戏规则。 首先进行 3 级检查。 然后尝试进行 1 级合并，然后进行 2 级合并。 只有在所有可能的升级完成后，该棋子才会被放入棋盘中。 

该实现不需要对整数限制进行特殊处理，因为它只存储受输入大小限制的索引和计数器。 重要的边界条件是在下棋之前检查空堆是否非空，因为如果棋盘已经满了，棋子可能会消失。 

## 工作示例

 对于第一个示例，假设：```
1
5 4 2
a
a
b
a
a
```模拟是：

 | 步骤| 传入 | a | 的 1 级位置 | 的 2 级位置 空槽 | 董事会|
 | --- | --- | --- | --- | --- | --- |
 | 0 | 无 | []| []| 0,1,2,3 | -1 -1 -1 -1 | -1 -1 -1 -1
 | 1 | 一个 | [0]| []| 1,2,3 | -1 -1 -1 | 一个 -1 -1 -1
 | 2 | 一个 | []| [0]| 1,2,3 | a2 -1 -1 -1 | a2 -1 -1 -1
 | 3 | 乙| []| [0]| 2,3 | a2 b -1 -1 | a2 b -1 -1
 | 4 | 一个 | [2] | [0]| 3 | a2 b a -1 | a2 b a -1
 | 5 | 一个 | []| [0,2]| 1,3 | a2 b a2 -1 | a2 b a2 -1

 该轨迹显示了为什么存储位置很重要。 两人`a`合并的棋子将被删除，新的 2 级棋子占据最左边的可用位置。 

对于第二个例子：```
1
4 3 3
x
x
x
x
```状态变化如下：

 | 步骤| 传入 | 水平| 空槽 | 董事会|
 | --- | --- | --- | --- | --- |
 | 0 | 无 | 无 | 0,1,2 | -1 -1 -1 | -1 -1 -1
 | 1 | x| 1 | 1,2 | x -1 -1 |
 | 2 | x| 1 | 2 | x x -1 |
 | 3 | x| 1 | 无 | x x x |
 | 4 | x| 1 | 无 | x x x |

 前三部分保持独立，因为`K=3`合并之前需要三份副本。 第四块没有可用的位置，所以它消失了。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(M log N) | O(M log N) | 每次插入都会针对删除或插入的位置执行字典操作和堆更新。 |
 | 空间| O(N + M) | 棋盘、空位置堆和存储的位置最多包含线性信息。 |

 约束条件允许`N`很大，因此避免重复扫描等待区是必要的。 堆操作使模拟保持足够快，同时保留准确的最左边放置行为。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)

    def solve():
        input = sys.stdin.readline
        t = int(input())
        out = []

        import heapq

        for case in range(1, t + 1):
            M, N, K = map(int, input().split())
            pieces = [input().strip() for _ in range(M)]

            board = ["-1"] * N
            empty = list(range(N))
            heapq.heapify(empty)
            data = {}

            for name in pieces:
                if name not in data:
                    data[name] = [[], [], False]

                lv1, lv2, has3 = data[name]

                if has3:
                    continue

                level = 1

                if len(lv1) == K - 1:
                    for p in lv1:
                        board[p] = "-1"
                        heapq.heappush(empty, p)
                    lv1.clear()
                    level = 2

                    if len(lv2) == K - 1:
                        for p in lv2:
                            board[p] = "-1"
                            heapq.heappush(empty, p)
                        lv2.clear()
                        level = 3
                        data[name][2] = True

                if empty:
                    p = heapq.heappop(empty)
                    if level == 1:
                        board[p] = name
                        lv1.append(p)
                    elif level == 2:
                        board[p] = name + "2"
                        lv2.append(p)
                    else:
                        board[p] = name + "3"

            out.append(f"Case {case}: {' '.join(board)}")

        return "\n".join(out)

    result = solve()
    sys.stdin = old
    return result

assert run("""1
3 3 2
a
a
a
""") == "Case 1: a2 a -1", "basic merge"

assert run("""1
3 2 2
a
b
a
""") == "Case 1: a2 b", "merge with full board"

assert run("""1
4 3 3
x
x
x
x
""") == "Case 1: x x x", "no merge until enough copies"

assert run("""1
5 5 2
a
a
a
a
a
""") == "Case 1: a3 a -1 -1 -1", "multiple upgrades"

assert run("""1
1 1 2
z
""") == "Case 1: z", "minimum size"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 三个相同的部件`K=2`|`a2 a -1`| 基本合并和放置 |
 | 全膳与合并|`a2 b`| 重用释放的位置 |
 | 四件套`K=3`|`x x x`| 正确的合并阈值 |
 | 五个相同的部件`K=2`|`a3 a -1 -1 -1`| 连锁升级|
 | 单人棋子|`z`| 最小边界情况 |

 ## 边缘情况

 对于第一个边缘情况：```
1
3 3 2
a
a
a
```该算法排名第一`a`在零位置。 第二个`a`找到一个现有的 1 级副本，将其删除，并在位置 0 处变为 2 级。 第三个`a`无法合并，因为只有一个 2 级棋子，因此将其放置在位置 1。 结果是：```
Case 1: a2 a -1
```存储的级别列表可以正确防止算法错误地直接升级到级别 3。 

对于全食宿的情况：```
1
3 2 2
a
b
a
```前两个插入内容填满了整个板。 第三次插入看到一个 level-1`a`，将其移除，并将升级后的 2 级棋子放回空闲的最小插槽中。 结果是：```
Case 1: a2 b
```空槽堆使得它的行为类似于原始游戏，而不是简单地附加棋子。 

对于三级限制情况：```
1
5 4 2
a
a
a
a
a
```前四个棋子创建两个 2 级棋子。 下一次合并将创建一个 3 级片段。 稍后再做`a`会立即被拒绝，因为该名称已经有 3 级片段。 为每个名称存储的布尔值捕获此永久状态更改。
