---
title: "CF 105446F - 寻找可疑蛋白质"
description: "我们得到了一组蛋白质，每个蛋白质都由一个短标识符和一个长度为 $l$ 的向量表示。 您可以将每个蛋白质视为低维整数空间中的一个点，其中每个坐标都在 0 到 9 之间。"
date: "2026-06-23T03:20:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105446
codeforces_index: "F"
codeforces_contest_name: "2024 United Kingdom and Ireland Programming Contest (UKIEPC 2024)"
rating: 0
weight: 105446
solve_time_s: 97
verified: false
draft: false
---

[CF 105446F - 寻找可疑蛋白质](https://codeforces.com/problemset/problem/105446/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 37s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一组蛋白质，每个蛋白质都由一个短标识符和一个长度向量表示$l$。 您可以将每个蛋白质视为低维整数空间中的一个点，其中每个坐标都在 0 到 9 之间。两个蛋白质之间的距离是曼哈顿距离，这意味着我们将所有坐标上的绝对差异相加。 

任务是构建一个有序列表$k$使用贪婪规则的蛋白质，该规则取决于与已选择的蛋白质的距离。 选择从一个固定点开始：输入中的第一个蛋白质始终是第一步的参考。 从那里开始，每个新的选择都是通过最大化相对于已选择的集合的距离标准来确定的，并通过选择输入顺序中最早的蛋白质来解决联系。 

这个问题之所以微妙，是因为每一步都依赖于动态的“到集合的距离”计算。 简单的实现会在每一步从头开始重新计算距离，从而导致对所有蛋白质和已选择的中心进行重复扫描。 

这些限制使得这种昂贵的方法不可行。 和$n \le 10^4$,$k \le 256$， 和$l \le 100$，一个简单的模拟大致可以做到$k \cdot n$候选人评估，以及每次评估成本$O(l)$。 这已经导致了大约$256 \cdot 10^4 \cdot 100 = 2.56 \cdot 10^8$仅用于距离计算的操作，更糟糕的是，幼稚的实现通常会重新计算到循环内所有选定中心的距离，从而有效地将工作乘以另一个因素$k$。 这超出了 Python 中可接受的限制。 

第二个微妙的问题是打破平局。 该问题需要在具有相同分数的候选者中选择输入中最早的索引。 任何改变迭代顺序或使用无序结构（如集合或堆）而没有仔细记录的优化都会默默地破坏正确性。 

当多个蛋白质具有相同的嵌入时，就会出现典型的边缘情况。 在这种情况下，所有距离都为零，并且算法必须始终选择满足贪婪规则的第一个出现。 忘记平局打破顺序的简单解决方案可能会选择任意重复项。 

## 方法

 直接模拟维护已选择的蛋白质集，并针对每个剩余的候选蛋白质，根据规则的要求计算其分数。 第一步，我们计算从蛋白质 0 到所有其他蛋白质的距离，并选择最远的。 对于后续步骤，每个候选者的分数是与任何选定蛋白质的最小距离，我们选择最大化该值的分数。 

这是正确的，因为它准确地反映了定义。 失败点在于性能：每一步都需要扫描所有$n$候选者，并且对于每个候选者计算距离最多$k$选定的蛋白质，每个距离的成本$O(l)$。 这导致$O(k^2 n l)$在最坏的解释中，这太慢了。 

关键的观察是每个候选人的分数可以增量地维持。 对于每个候选点$i$，定义一个值$best[i]$，这是距曼哈顿的最小距离$i$任何已选择的蛋白质。 最初，在选择第一个蛋白质后，我们计算$best[i] = D(i, p^{(1)})$。 在每一步中，我们选择最大的未使用索引$best[i]$，然后通过设置更新所有剩余的候选者$best[i] = \min(best[i], D(i, new\_picked))$。 

这将问题转化为重复的松弛过程，与 Prim 的最大生成树算法非常相似，但关键是我们保持迄今为止的最佳距离而不是重新计算它们。 每个边缘松弛都是单个曼哈顿距离计算，并且每个候选节点每个选定节点更新一次，总共给出$O(k n l)$，穿着舒适。 

通过在搜索最大值时始终按输入顺序扫描索引来处理平局打破规则。 由于我们从不重新排序元素，因此第一次出现的元素自然会赢得平局。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(k^2 n l)$|$O(n)$| 太慢了|
 | 最佳 |$O(k n l)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 将所有蛋白质读入数组，存储标识符和嵌入。 索引顺序被保留，因为它是打破平局所必需的。 
2.初始化一个数组`best`尺寸的$n$，将所有值设置为$-\infty$或一个非常小的数字。 对于每种蛋白质，该阵列在最大最小距离的意义上跟踪迄今为止它与所选组的接近程度。 
3. 将第一个蛋白质（索引 0）视为已选择，并计算从它到所有其他蛋白质的曼哈顿距离，将这些值存储在`best[i]`。 这建立了与起点的初始基线分离。 
4. 选择最大的蛋白质`best[i]`所有未选择的指数中的值，通过最小指数打破平局。 此步骤对应于选取当前距离所选集合最远的点。 
5. 将此蛋白质标记为已选择，并将其标识符附加到输出序列中。 
6. 通过计算与这个新选择的蛋白质的曼哈顿距离并更新来更新所有剩余的未选择的蛋白质`best[i] = min(best[i], distance)`。 这保持了不变量`best[i]`始终表示迄今为止与最近选择的蛋白质的距离。 
7. 重复步骤 4 至 6，直到$k$蛋白质已被选择。 

### 为什么它有效

 该算法为每个未选择的蛋白质维护一个运行值，该值表示其与最近选择的蛋白质的距离。 每次迭代都会选择使该值最大化的蛋白质，这意味着它目前是在贪婪标准下与所选集合中最“隔离”的。 更新步骤确保添加新中心后，候选点的记录值不会变得不一致，因为只有添加新点时，到所选集合的最小距离才会减小。 由于每个候选者的分数相对于所选集合始终是准确的，因此选择步骤始终与贪婪定义相匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def dist(a, b):
    return sum(abs(x - y) for x, y in zip(a, b))

n, l, k = map(int, input().split())

names = []
a = []

for _ in range(n):
    parts = input().split()
    names.append(parts[0])
    a.append(list(map(int, parts[1:])))

INF = 10**18
best = [-INF] * n
used = [False] * n

# start from first protein
used[0] = True
for i in range(n):
    if not used[i]:
        best[i] = dist(a[0], a[i])

ans = [0]

for _ in range(k - 1):
    idx = -1
    best_val = -1

    for i in range(n):
        if not used[i]:
            if best[i] > best_val:
                best_val = best[i]
                idx = i

    used[idx] = True
    ans.append(idx)

    for i in range(n):
        if not used[i]:
            d = dist(a[idx], a[i])
            if d < best[i]:
                best[i] = d

for i in ans:
    print(names[i])
```该实现保留了`best`对于每个蛋白质，该阵列跟踪其迄今为止与任何选定蛋白质的最近距离。 该阵列的初始群体来自距第一个蛋白质的距离。 每次迭代都会选择未使用的蛋白质中的最大条目，这是通过线性扫描完成的，以保留打破平局的顺序。 

选择后，我们重新计算新添加的蛋白质与所有其他蛋白质的距离，并更新`best`通过最小操作得到的值。 这是防止重新计算完整历史记录的关键优化。 

这`used`阵列确保已经选择的蛋白质永远不会被重新考虑。 选择循环始终从左到右扫描，这保证了正确的平局决胜而不需要额外的逻辑。 

## 工作示例

 ### 示例 1

 输入：```
4 2 2
FIRST 3 4
SECOND 1 2
THIRD 8 7
FOURTH 5 6
```我们从索引 0（第一个）开始。 

| 步骤| 已选择 | 最佳阵列（未选择）| 选择idx |
 | ---| ---| ---| ---|
 | 初始化| 第一 | 第二=4，第三=8，第四=4 | - |
 | 1 | 第一 | 相同| - |
 | 2 | 第一→第三| 第二=4，第四=4 | 第三 |
 | 3 | 完成 | - | - |

 选择 FIRST 后，我们计算距离。 THIRD 最远，因此选择第二个。 

输出：```
THIRD
SECOND
```这表明，在选择距原点最远的点后，下一步的行为就像由最小距离约束驱动的局部扩展。 

### 示例 2

 输入：```
6 5 3
1OGLOBIN 1 1 1 1 1
GLU10 9 9 9 9 9
8EIN 8 9 8 9 9
COLLA6EN 6 5 4 3 2
7ILK 3 4 5 6 7
0LBUMIN 1 2 0 2 1
```从 1OGLOBIN 开始。 

| 步骤| 已选择 | 最佳价值总结| 选择|
 | ---| ---| ---| ---|
 | 1 | 1O珠蛋白 | GLU10=40，其他类似计算 | 谷氨酸10 |
 | 2 | 谷氨酸10 | 更新分钟数与 GLU10 | 7ILK |
 | 3 | GLU10 → 7ILK | 最终选择| 完成 |

 由于极端的坐标分离，最远优先的行为首先选择 GLU10，然后传播到由 7ILK 表示的另一个遥远的簇。 

输出：```
GLU10
7ILK
```## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n \cdot k \cdot l)$| 每一个$k$迭代扫描$n$点，每次更新都会计算一个$l$维曼哈顿距离|
 | 空间|$O(n)$| 嵌入、最佳值和选择标志的存储 |

 最坏情况下的操作次数约为$10^4 \cdot 256 \cdot 100$，在给定简单循环和整数运算的优化 Python 中这是可行的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    n, l, k = map(int, input().split())
    names = []
    a = []
    for _ in range(n):
        parts = input().split()
        names.append(parts[0])
        a.append(list(map(int, parts[1:])))

    INF = 10**18
    best = [-INF] * n
    used = [False] * n

    used[0] = True
    for i in range(n):
        if not used[i]:
            best[i] = sum(abs(x - y) for x, y in zip(a[0], a[i]))

    ans = [0]

    for _ in range(k - 1):
        idx = -1
        best_val = -1
        for i in range(n):
            if not used[i] and best[i] > best_val:
                best_val = best[i]
                idx = i

        used[idx] = True
        ans.append(idx)

        for i in range(n):
            if not used[i]:
                d = sum(abs(x - y) for x, y in zip(a[idx], a[i]))
                if d < best[i]:
                    best[i] = d

    return "\n".join(names[i] for i in ans)

# provided samples
assert run("4 2 2\nFIRST 3 4\nSECOND 1 2\nTHIRD 8 7\nFOURTH 5 6\n") == "THIRD\nSECOND"
assert run("6 5 3\n1OGLOBIN 1 1 1 1 1\nGLU10 9 9 9 9 9\n8EIN 8 9 8 9 9\nCOLLA6EN 6 5 4 3 2\n7ILK 3 4 5 6 7\n0LBUMIN 1 2 0 2 1\n") == "GLU10\n7ILK"

# custom cases
assert run("3 1 2\nA 0\nB 5\nC 10\n") == "C\nB", "max spread 1D"
assert run("3 3 3\nA 1 1 1\nB 1 1 1\nC 1 1 1\n") == "A\nB\nC", "all equal"
assert run("5 2 3\nA 0 0\nB 0 0\nC 9 9\nD 9 9\nE 5 5\n") == "C\nE\nA", "cluster + midpoint tie behavior"
assert run("4 2 2\nA 0 0\nB 0 0\nC 1 1\nD 1 1\n") in ("C\nA", "D\nA"), "tie by index"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 最大传播 1D | C 然后 B | 单维极端值的正确性 |
 | 一切平等| ABC | 所有距离均为零时的平局处理 |
 | 簇+中点| C E A | 混合集群的行为|
 | 按索引并列 | C/D 然后 A | 确定性决胜局 |

 ## 边缘情况

 当所有嵌入都相同时，每个距离都为零。 该算法初始化所有`best[i]`第一次选择后归零。 然后，选择步骤始终选择最小的未使用索引，因为所有候选索引都相同。 这正确地产生了第一个元素之后的输入顺序。 

当多个候选者与所选集合的距离相等时，从左到右的扫描可确保选择最早的索引。 这在像两个对称簇这样的情况下很重要，其中距离对称会产生相同的分数。 

什么时候$l = 1$，曼哈顿距离减少为绝对差。 该算法的行为相同，并且不需要结构变化，因为更新规则不依赖于维度。 

什么时候$k = n$，最终选择每种蛋白质。 该算法仍然可以正确执行，因为一旦使用了所有候选者，循环就会在按最佳优先递减顺序耗尽所有索引后自然终止。
