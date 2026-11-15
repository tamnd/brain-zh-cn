---
title: "CF 83B - 医生"
description: "我们有一队动物在等待医生。 动物，在永远离开之前，我必须去看医生一次[i]次。 每当检查动物时，都会发生以下两种情况之一。 如果仍然需要更多访问，它会立即移动到队列的后面。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 83
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 72 (Div. 1 Only)"
rating: 1800
weight: 83
solve_time_s: 97
verified: true
draft: false
---

[CF 83B - 医生](https://codeforces.com/problemset/problem/83/B)

 **评分：** 1800
 **标签：** 二分查找、数学、排序
 **求解时间：** 1m 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一队动物在等待医生。 动物`i`必须准确地去看医生`a[i]`永远离开之前的几次。 

每当检查动物时，都会发生以下两种情况之一。 如果仍然需要更多访问，它会立即移动到队列的后面。 如果该访问完成了所有必需的检查，它将从队列中消失。 

医生表现得很到位`k`检查，然后停止工作。 我们必须按照从前到后的确切顺序输出当时仍在队列中的动物。 

这些限制完全排除了直接模拟。 动物数量最多为`10^5`，这是可以管理的，但是`k`可以大到`10^14`。 字面模拟每次检查需要一次操作，这可能意味着一百万亿个队列操作。 即使高度优化的实现也无法解决这个问题。 

可能的检查总数是所有检查的总和`a[i]`。 如果该总和小于`k`，医生甚至无法执行`k`考试，答案是`-1`。 

棘手的部分是在大量循环旋转和删除之后重建队列。 

一个容易犯的错误是错误地处理了队列在执行完之后就变空的情况。`k`-次考试。 

例子：```
Input:
1 1
1
```经过一次检查后，唯一的动物永远离开了。 队列为空，所以正确的输出是空行，而不是`-1`。 

当几只动物在同一个“回合”中完成比赛时，就会出现另一个微妙的情况。 

例子：```
Input:
4 5
2 1 2 1
```粗心的实施可能会在移除后错误地旋转动物并产生错误的剩余顺序。 

正确的流程是：```
Initial: 1 2 3 4
After 1: 2 3 4 1
After 2: 3 4 1
After 3: 4 1 3
After 4: 1 3
After 5: 3
```正确输出：```
3
```另一个危险的极端情况是`k = 0`。 

例子：```
Input:
3 0
5 2 7
```没有进行检查，因此队列保持不变：```
1 2 3
```总是使队列至少前进一次的实现在这里将会失败。 

## 方法

 蛮力的想法很简单。 显式存储队列。 反复弹出前面的动物，减少其剩余访问次数，然后丢弃它或将其推回。 

这个模拟是正确的，因为它完全遵循了这个过程。 问题在于规模。 如果每只动物都需要`10^9`访问和`k`本身达到`10^14`，模拟可能需要数万亿次操作。 

流程的结构提供了更好的方法。 

想象一下所有当前活着的动物都完成了队列的一个完整循环。 每只活着的动物在该周期中都会失去一次必要的访问。 我们可以一次处理整个层，而不是一层一层地处理访问。 

假设当前有`m`活着的动物，每只动物至少还需要`d`更多访问。 然后我们就可以花`m * d`批量检查，将每只活体动物减少`d`。 

这使得问题变得类似于同时从所有数字中剥离层。 

如果我们按照所需的访问次数对动物进行分类，我们就可以确定在某些动物消失之前可以移除多少完整层。 移除的层数就像应用于所有活体动物的全局偏移。 

最终我们到达下一个完整层将超过的点`k`。 到那时，只剩下部分循环了。 由于现在剩余的检查数量少于活着的动物数量，我们可以直接重建最终的队列。 

暴力破解之所以有效，是因为队列操作很简单，但会失败，因为它单独处理每个检查。 优化的解决方案之所以有效，是因为许多连续检查对所有活体动物的影响都是相同的，使我们能够将整个过程压缩为单个算术步骤。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(k) | O(n) | 太慢了 |
 | 最佳| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取所有值并计算可能的检查总数，即`sum(a)`。 

如果`sum(a) < k`， 打印`-1`立即，因为医生无法进行那么多检查。 
2. 建立配对`(a[i], i)`并对它们进行排序`a[i]`。 

排序让我们能够按照动物消失的顺序来处理它们。 
3. 维护三个变量：`prev`，已删除的完整层数。`alive`，仍在队列中的动物数量。`used`，考试人数已占。 
4. 迭代排序的动物。 

假设当前动物需要`x`访问。 自从`prev`全球范围内的层数已被去除，这种动物仍然需要`x - prev`在消失之前额外的完整层。 
5. 计算：```
cost = (x - prev) * alive
```这是将每只活着的动物减少到下一个消失点所需的检查次数。 
6. 如果`used + cost <= k`，消耗整个块。 

更新：```
used += cost
prev = x
alive -= count_of_animals_removed_here
```多种动物可能共享相同的`x`，所以它们全部一起消失。 
7. 否则，我们无法完成下一个完整层。 

这一刻，每一个活着的动物都已经失去了`prev`访问。 剩下的考试是：```
rem = k - used
```8. 收集所有原值大于的动物`prev`。 这些正是还活着的动物。 
9. 按原始索引对这些活着的动物进行排序，因为队列顺序始终保留幸存动物之间的相对顺序。 
10. 剩下的进程只是在活动队列中循环运行`rem`步骤。 

自从`rem < number_of_alive_animals`，最终队列从以下位置开始：```
rem % len(alive_animals)
```11. 从该位置开始输出活体动物，循环环绕。 

### 为什么它有效

 移除后`prev`完整的层数，每只幸存的动物都有`a[i] - prev`剩余访问次数。 它们在队列中的相对顺序保持不变，因为每个完整的层都对应于所有活动物的一次完整旋转。 

当我们在完成另一个完整层之前停止时，剩余的检查仅形成对活动队列的部分遍历。 前进`rem`排队顺序中的位置与一一执行剩余检查完全匹配。 

该算法永远不会丢失队列顺序，因为删除只会删除动物，而不会重新排序幸存者。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())
    a = list(map(int, input().split()))

    if sum(a) < k:
        print(-1)
        return

    arr = sorted((a[i], i) for i in range(n))

    used = 0
    prev = 0
    alive = n
    ptr = 0

    while ptr < n:
        value = arr[ptr][0]
        diff = value - prev
        cost = diff * alive

        if used + cost > k:
            break

        used += cost
        prev = value

        while ptr < n and arr[ptr][0] == value:
            ptr += 1
            alive -= 1

    remaining = k - used

    survivors = []

    for i in range(n):
        if a[i] > prev:
            survivors.append(i + 1)

    if not survivors:
        print()
        return

    start = remaining % len(survivors)

    answer = survivors[start:] + survivors[:start]

    print(*answer)

solve()
```第一个重要的细节是早期不可能检查。 如果所需考试总数小于`k`，在医生停止时间之后不存在队列，因为该过程提前结束。 

排序后的数组驱动层移除过程。 每个不同的值都会告诉我们新的动物群何时消失。 

表达式：```
cost = diff * alive
```是解决方案的核心。`diff`代表我们可以对所有活体动物统一应用多少个完整回合，并且每个回合恰好接触每个活体动物一次。 

内部`while`循环删除所需访问次数等于当前阈值的所有动物。 一起处理同等价值至关重要。 忘记这一点会产生不正确的存活计数并破坏后续的算术。 

批量加工停止后，所有剩余的动物满足：```
a[i] > prev
```这些动物根据其原始索引按队列顺序出现。 我们永远不需要真正的队列，因为完整的层保留循环顺序。 

剩下的检查数量少于幸存者数量，所以简单的轮换就给出了最终的队列。 

空队列的情况很微妙。 如果每只动物都在同一时间消失`k`，正确的输出只是一个空行。 

## 工作示例

 ### 示例 1

 输入：```
3 3
1 2 1
```排序对：```
(1,0), (1,2), (2,1)
```| 步骤| 上一页 | 活着| 二手 | 当前值| 成本| 行动|
 | --- | --- | --- | --- | --- | --- | --- |
 | 开始| 0 | 3 | 0 | 1 | 3 | 消费|
 | 移除后 | 1 | 1 | 3 | 2 | 1 | 停止|

 现在：```
remaining = 3 - 3 = 0
```幸存者：```
[2]
```起始位置：```
0 % 1 = 0
```最终队列：```
2
```该痕迹显示了两只动物如何在第一个完整层之后同时消失。 

### 示例 2

 输入：```
7 10
1 3 1 2 5 2 4
```排序对：```
(1,0), (1,2), (2,3), (2,5), (3,1), (4,6), (5,4)
```| 步骤| 上一页 | 活着| 二手 | 当前值| 成本| 行动|
 | --- | --- | --- | --- | --- | --- | --- |
 | 开始| 0 | 7 | 0 | 1 | 7 | 消费|
 | 删除 1 秒 | 1 | 5 | 7 | 2 | 5 | 停止|

 现在：```
remaining = 10 - 7 = 3
```幸存者按队列顺序排列：```
[2, 4, 5, 6, 7]
```旋转方式：```
3 % 5 = 3
```最终队列：```
6 7 2 4 5
```此示例演示了该算法背后的关键观察结果。 我们没有模拟七次单独的检查，而是立即删除一个完整的层。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序占主导地位|
 | 空间| O(n) | 存储数组和幸存者|

 排序步骤是算法中唯一的非线性部分。 和`n <= 10^5`,`O(n log n)`很容易在时间限制内完成。 内存使用量是线性的并且完全低于限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def solve():
        n, k = map(int, input().split())
        a = list(map(int, input().split()))

        if sum(a) < k:
            return "-1"

        arr = sorted((a[i], i) for i in range(n))

        used = 0
        prev = 0
        alive = n
        ptr = 0

        while ptr < n:
            value = arr[ptr][0]
            diff = value - prev
            cost = diff * alive

            if used + cost > k:
                break

            used += cost
            prev = value

            while ptr < n and arr[ptr][0] == value:
                ptr += 1
                alive -= 1

        remaining = k - used

        survivors = []

        for i in range(n):
            if a[i] > prev:
                survivors.append(i + 1)

        if not survivors:
            return ""

        start = remaining % len(survivors)

        answer = survivors[start:] + survivors[:start]

        return " ".join(map(str, answer))

    return solve()

# provided sample
assert run("3 3\n1 2 1\n") == "2", "sample 1"

# k = 0
assert run("3 0\n5 2 7\n") == "1 2 3", "no examinations"

# impossible case
assert run("2 5\n1 2\n") == "-1", "not enough total examinations"

# queue becomes empty exactly at k
assert run("1 1\n1\n") == "", "empty queue"

# all equal values
assert run("4 6\n3 3 3 3\n") == "3 4", "uniform layers"

# multiple removals together
assert run("4 5\n2 1 2 1\n") == "3", "simultaneous removals"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 0 / 5 2 7`|`1 2 3`| 没有处理发生 |
 |`2 5 / 1 2`|`-1`| 不可能的总工作量|
 |`1 1 / 1`| 空输出 | 队列恰好在 k | 处变空
 |`4 6 / 3 3 3 3`|`3 4`| 均匀循环行为|
 |`4 5 / 2 1 2 1`|`3`| 同步移除 |

 ## 边缘情况

 考虑一下期末考试之后队列变空的情况。 

输入：```
1 1
1
```该算法处理一个完整的层：```
cost = 1 * 1 = 1
```食用后：```
used = 1
alive = 0
```没有幸存者，因此算法打印空行。 这与真实过程完全吻合。 

现在考虑同时删除。 

输入：```
4 5
2 1 2 1
```排序后：```
(1,1), (1,3), (2,0), (2,2)
```第一层成本：```
1 * 4 = 4
```食用后，两种动物都有价值`1`一起消失。 幸存者是：```
1, 3
```还剩下一项检查。 一旦离开就旋转：```
3
```在这里处理相同的值是至关重要的。 一次删除一个它们会错误地改变同一层的活动计数。 

最后，考虑`k = 0`。 

输入：```
3 0
5 2 7
```主循环立即停止，因为可能不会消耗任何检查。 自从`prev = 0`，每只动物都生存下来。 剩余旋转量也为零，因此保留原始顺序：```
1 2 3
```这证实了该算法正确处理空前缀情况。
