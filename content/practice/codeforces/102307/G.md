---
title: "CF 102307G - 毕业"
description: "每条路线都是有向图中的一个顶点。 如果a[i] = j，则课程i必须在课程j之前完成。 在这个前提关系中，a[i] = 0 的课程在其之后没有课程。"
date: "2026-08-13T07:19:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102307
codeforces_index: "G"
codeforces_contest_name: "2019 ICPC Universidad Nacional de Colombia Programming Contest"
rating: 0
weight: 102307
solve_time_s: 111
verified: true
draft: false
---

[CF 102307G - 毕业](https://codeforces.com/problemset/problem/102307/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每条路线都是有向图中的一个顶点。 如果`a[i] = j`，那么当然`i`必须在课程之前完成`j`。 课程与`a[i] = 0`在这个先决关系中，它之后没有任何过程。 

关键的结构限制是每门课程最多只能是另一门课程的先决条件。 用图的术语来说，每个顶点的出度最多为 1。 由于保证毕业是可能的，因此相关图不包含有向循环。 因此，该图是树木的集合，其边缘指向其最终路线。 

一个学期最多可以包含`k`课程，并且一个学期中的每门课程都必须在前几个学期完成所有先决条件。 任务是尽量减少完成所有任务所需的学期数`n`课程。 

的价值`n`可以达到`10^4`， 尽管`k`至多是`10`。 这立即排除了所有课程的子集动态规划，因为`2^10000`状态远远超出了任何可以在一秒钟内运行的东西。 的小值`k`对于描述可能的学期选择很有用，但它并不能让暴力破解变得实用，因为仍然有大量可用的课程。 

有几种边缘情况可能会使简单的拓扑排序给出错误的答案。 首先，简单地选修任意可用的课程并不是最佳选择。 考虑```
5 2
2 3 0 0 0
```课程`1 -> 2 -> 3`形成链条，同时课程`4`和`5`是独立的。 答案是`3`: 参加课程`1,4`， 然后`2,5`， 然后`3`。 粗心的算法可能会导致`4,5`首先，然后需要四个学期。 

其次，拥有足够的能力来学习所有当前可用的课程并不意味着可以立即学习新解锁的课程。 为了```
4 2
3 3 4 0
```课程`1`和`2`解锁课程`3`，然后解锁课程`4`。 答案是`3`， 不是`2`。 一个学期完成的课程直到下个学期才能满足先决条件。 

最后，没有后继者的课程最初不一定可用。 为了```
3 3
0 1 2
```边缘是`3 -> 2 -> 1`。 虽然当然`1`是最后一门课程，直到课程结束后才能参加`3`和`2`已完成。 答案是`3`， 虽然`k = 3`。 

## 方法

 自然的暴力解决方案将代表一组已经完成的课程，并递归地尝试最多的每一个合法选择`k`目前可以选择下学期的课程。 这是正确的，因为每个可能的有效计划都出现在搜索树中的某个位置，因此对所有计划取最小值即可给出最佳值。 

问题在于州的数量。 DP 子集已经有`2^n`可能的已完成课程集。 为了`n = 10000`，这意味着`2^10000`州。 如果我们还枚举一个学期可能修读的课程组，则仅第一个状态就可以

 [
 \sum_{j=1}^{10} {10000 \选择 j}
 ]

 可能的选择，具有最大的项`C(10000,10)`大约`2.76 * 10^33`。 蛮力方法不仅有点太慢，而且它的状态空间基本上是指数级的。 

图的限制为我们提供了一种更强大的方式来推理时间表。 每门课程至多有一个后继者，因此任何课程都有一条通向最终课程的独特路径。 将课程的级别定义为从该课程开始并遵循其最终课程的先决条件的最长路径的长度。 最终课程有水平`0`，其直接先决条件有水平`1`， 等等。 

假设当前有两门课程可用。 如果一个人的水平更高，完成它就更紧迫，因为还有更长的课程链需要遵循。 在某个级别上花费一个学期`0`离开级别时的独立课程`5`不受影响的过程可能会延迟整个关键链。 

这导致了最高层优先的贪心算法。 每学期开始时，在所有当前可用的课程中，最多选修`k`级别最高的课程。 整个学期结束后，从图表中删除这些课程，并添加现在已失去所有先决条件的每门课程。 

这是经典的内树上单位时间调度的最高层优先算法，这正是这里获得的结构，因为每个课程最多有一个后继者。 众所周知，该算法可以为这种特殊的优先级结构生成最小完工计划。 

蛮力之所以有效，是因为它明确地考虑了每个可能的计划，但当计划数量呈指数级增长时，它就会失败。 通过观察先决条件图是树内森林，我们可以为每个课程分配一个关键路径级别，并用优先级队列替换时间表枚举。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 至少呈指数形式`O(2^n)`状态 |`O(2^n)`| 太慢了|
 | 最佳 |`O(n log n)`|`O(n)`| 已接受 |

 ## 算法演练

 1. 阅读后继者`a[i]`每门课程并计算每门课程的先决条件数量。 对于课程`v`，这是课程数`u`满意的`a[u] = v`。 一开始就提供先决条件计数为零的课程。 
2. 计算每门课程的水平。 从所有没有先决条件的课程开始，因为它们是先决条件树的叶子。 给每个这样的课程级别`0`，然后按拓扑顺序处理它们。 当一门课程`u`指向`v`， 更新`v`和`level[u] + 1`。 自从`v`只有在处理了所有先决条件后才可用，该值的最大值恰好是从`v`到最后一门课程。 
3. 恢复原始先决条件计数。 第一个拓扑通道仅用于计算级别，而第二个通道将代表实际的学期时间表。 
4. 将每个最初可用的课程放入最大优先级队列，使用其级别作为优先级。 蟒蛇的`heapq`是一个最小堆，所以存储`-level`反而。 
5. 每学期开始时，最多移除`k`从优先级队列中取出课程并将它们放入单独的批次中。 这种分离很重要，因为这批解锁的课程不能在同一学期修读。 
6. 选择批次后，将其所有课程标记为已完成。 对于每门已完成的课程`u`，看看它独特的后继者`v`。 减少`v`剩余先决条件计数。 如果变为零，则插入`v`进入优先级队列及其级别。 
7. 增加学期数并重复，直到完成所有课程。 迭代次数是最小学期数。 

### 为什么它有效

 关键的不变量是优先级队列始终包含当前学期开始时合法可用的课程，并按剩余关键路径的长度排序。 

对于此图结构，具有较高级别的课程位于仍必须完成的较长链的头部。 最高级别优先安排每个学期的课程，推迟最有可能延长最终完成时间。 因为每门课程最多有一个后继课程，并且每门课程都需要一个学期的学习，所以优先级约束形成树内森林，即最高级别优先调度的最佳设置。 因此，可以选择每个贪婪的学期，而不会增加可能的最短完成时间，并且在处理所有课程后，最终的学期数是最佳的。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def solve(stream):
    data = list(map(int, stream.read().split()))
    if not data:
        return ""

    it = iter(data)
    n = next(it)
    k = next(it)

    nxt = [next(it) - 1 for _ in range(n)]

    # indeg[v] = number of prerequisites of v.
    indeg = [0] * n
    for v in nxt:
        if v != -1:
            indeg[v] += 1

    # First topological pass: calculate the level of every course.
    # level[u] is the length of the longest path from u to a terminal course.
    rem = indeg[:]
    level = [0] * n
    q = []

    for u in range(n):
        if rem[u] == 0:
            q.append(u)

    head = 0
    while head < len(q):
        u = q[head]
        head += 1

        v = nxt[u]
        if v != -1:
            level[v] = max(level[v], level[u] + 1)
            rem[v] -= 1
            if rem[v] == 0:
                q.append(v)

    # Second pass: actually construct the optimal schedule.
    rem = indeg[:]

    pq = []
    for u in range(n):
        if rem[u] == 0:
            heapq.heappush(pq, (-level[u], u))

    completed = 0
    semesters = 0

    while completed < n:
        batch = []

        # Choose the courses for this semester before releasing
        # anything unlocked by them.
        take = min(k, len(pq))
        for _ in range(take):
            _, u = heapq.heappop(pq)
            batch.append(u)

        # Complete the whole batch simultaneously.
        for u in batch:
            completed += 1

        # Only now can successors become available.
        for u in batch:
            v = nxt[u]
            if v != -1:
                rem[v] -= 1
                if rem[v] == 0:
                    heapq.heappush(pq, (-level[v], v))

        semesters += 1

    return str(semesters)

def main():
    print(solve(sys.stdin))

if __name__ == "__main__":
    main()
```第一部分`solve`读取后继数组并构建`indeg`。 由于每门课程至多有一个后继者，因此无需维护邻接列表。 单一值`nxt[u]`足以找到唯一可以解锁的课程`u`已完成。 

第一个拓扑通道使用名为`rem`。 每片初始叶子都有`rem[u] == 0`，这样就可以开始遍历了。 什么时候`u`已处理，其后继者`v`获得候选人级别`level[u] + 1`。 取最大值是必要的，因为一门课程可能有很多先决条件，并且其级别必须占其链中最长的。 

第二遍副本`indeg`再次因为第一遍消耗了先决条件计数。 重用修改后的数组会使每门课程都过早出现。 

优先级队列存储`(-level[u], u)`。 取消该级别会将 Python 的最小堆转换为所需的最大堆。 课程编号仅用作确定性决胜局，对正确性没有影响。 

这`batch`数组是一个微妙但必要的细节。 我们首先删除当前学期的所有课程，然后处理其后续课程。 如果在每次删除后立即将后继者插入到堆中，并且允许堆在同一迭代中提供另一门课程，则可以在同一学期内选修一门课程作为其先决条件。 单独的批次可以防止出现相差一的错误。 

Python中不可能出现整数溢出，最大级别为`n - 1`。 堆最多包含`n`条目，因此其内存使用量保持线性。 

## 工作示例

 ### 示例 1

 输入是```
4 2
3 3 4 0
```边缘是`1 -> 3`,`2 -> 3`， 和`3 -> 4`。 级别是`level[1] = 2`,`level[2] = 2`,`level[3] = 1`， 和`level[4] = 0`。 

| 学期 | 学期前可用 | 等级 | 所修课程 | 新品上市 |
 | --- | --- | --- | --- | --- |
 | 1 |`1, 2`|`2, 2`|`1, 2`|`3`|
 | 2 |`3`|`1`|`3`|`4`|
 | 3 |`4`|`0`|`4`| 无 |

 第一学期的两门课程都处于关键水平`2`。 完成后，当然`3`变得可用。 课程`4`无法参加第二学期，因为课程`3`是在该学期完成的。 答案是`3`。 

### 示例 2

 输入是```
3 3
0 1 2
```该图是单链`3 -> 2 -> 1`。 其等级为`2`,`1`， 和`0`。 

| 学期 | 学期前可用 | 等级 | 所修课程 | 新品上市 |
 | --- | --- | --- | --- | --- |
 | 1 |`3`|`2`|`3`|`2`|
 | 2 |`2`|`1`|`2`|`1`|
 | 3 |`1`|`0`|`1`| 无 |

 尽管容量为每学期三门课程，但优先级链每个阶段仅允许一门课程。 答案是`3`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n log n)`| 每个课程最多进入和离开优先级队列一次，并且每条边都被处理恒定的次数 |
 | 空间|`O(n)`| 后继数组、先决条件计数、级别、拓扑队列和优先级队列都是线性的 |

 只有`n`前提关系，因为每门课程至多有一个后继者。 和`n <= 10000`,`O(n log n)`仅执行少量堆操作，并且完全在一秒的限制内。 线性辅助存储也远低于256 MB 内存限制。 

## 测试用例```python
import sys
import io
import heapq

input = sys.stdin.readline

def solve(stream):
    data = list(map(int, stream.read().split()))
    if not data:
        return ""

    it = iter(data)
    n = next(it)
    k = next(it)
    nxt = [next(it) - 1 for _ in range(n)]

    indeg = [0] * n
    for v in nxt:
        if v != -1:
            indeg[v] += 1

    rem = indeg[:]
    level = [0] * n
    q = []

    for u in range(n):
        if rem[u] == 0:
            q.append(u)

    head = 0
    while head < len(q):
        u = q[head]
        head += 1

        v = nxt[u]
        if v != -1:
            level[v] = max(level[v], level[u] + 1)
            rem[v] -= 1
            if rem[v] == 0:
                q.append(v)

    rem = indeg[:]
    pq = []

    for u in range(n):
        if rem[u] == 0:
            heapq.heappush(pq, (-level[u], u))

    completed = 0
    semesters = 0

    while completed < n:
        batch = []

        for _ in range(min(k, len(pq))):
            _, u = heapq.heappop(pq)
            batch.append(u)

        completed += len(batch)

        for u in batch:
            v = nxt[u]
            if v != -1:
                rem[v] -= 1

        for u in batch:
            v = nxt[u]
            if v != -1 and rem[v] == 0:
                heapq.heappush(pq, (-level[v], v))

        semesters += 1

    return str(semesters)

def run(inp: str) -> str:
    return solve(io.StringIO(inp)).strip()

# Provided samples
assert run("4 2\n3 3 4 0\n") == "3", "sample 1"
assert run("3 3\n0 1 2\n") == "3", "sample 2"

# Minimum-size input
assert run("1 1\n0\n") == "1", "single course"

# Maximum-size input, all values equal to zero
assert run("10000 10\n" + " ".join(["0"] * 10000) + "\n") == "1000", \
    "10000 independent courses with capacity 10"

# Capacity is large enough for all courses, but precedence still forces a chain
assert run("4 4\n2 3 4 0\n") == "4", \
    "large semester capacity cannot bypass prerequisites"

# Taking arbitrary available courses first would be suboptimal
assert run("5 2\n2 3 0 0 0\n") == "3", \
    "highest-level priority is necessary"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / 0`|`1`| 最小尺寸实例 |
 |`10000 10 / all zeros`|`1000`| 最大限度`n`、最大批处理和全部相等的后继值 |
 |`4 4 / 2 3 4 0`|`4`| 优先级主导容量并捕获同学期解锁错误 |
 |`5 2 / 2 3 0 0 0`|`3`| 说明为什么任意拓扑调度不是最优的 |

 ## 边缘情况

 对于单课程情况```
1 1
0
```唯一的课程的先决条件计数为零且级别为零。 立即进入优先级队列，第一批被选中，完成计数变为1。 循环在一个学期后停止，产生`1`。 

对于每门课程都是独立的情况，```
6 2
0 0 0 0 0 0
```所有六门课程的级别均为零并且最初可用。 优先级队列包含所有六门课程，该算法一次处理两门课程。 这些批次包含两门、两门和两门课程，所以答案是`3`。 这正是`ceil(6 / 2)`。 

对于长链条的大容量，```
4 4
2 3 4 0
```理论上，所有四门课程都可以适合一个学期，但只有一门课程`1`最初可用。 第一学期后，课程`2`可用，然后是课程`3`，最后当然是`4`。 该算法产生四个学期，因为在每批之前都会检查优先级约束。 

最能说明问题的案例是```
5 2
2 3 0 0 0
```最初，课程`1`,`4`， 和`5`可用。 他们的水平是`2`,`0`， 和`0`。 优先队列选择`1`与一门独立课程一起，然后选择`2`加上剩下的独立课程，最后选择`3`。 结果是三个学期。 如果实现只是按队列顺序消耗可用课程，它可以选择`4`和`5`首先并获得四个学期，这就是为什么级别优先至关重要。 

最后，新解锁的课程必须等到下学期。 在```
4 2
3 3 4 0
```课程`1`和`2`是在第一学期进行的。 只有整个学期结束后，课程才会开始`3`输入可用的集合。 课程`4`在第二学期后发布，因此必须在第三学期进行。 基于批处理的实现可以正确处理此问题，因为只有在选择了当前学期的所有课程之后才会进行后续更新。
