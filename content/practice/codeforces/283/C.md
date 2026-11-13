---
title: "CF 283C - 硬币问题"
description: "我们有 n 种硬币。 硬币类型 i 的值为 a[i]，我们可以采用该类型的任何非负数硬币。 所有选定硬币的总价值必须恰好为 t。 此外，我们还给出了以下形式的不等式约束： count[b] count[c] 这些约束是特殊的。"
date: "2026-06-05T09:31:00+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 283
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 174 (Div. 1)"
rating: 2100
weight: 283
solve_time_s: 90
verified: true
draft: false
---

[CF 283C - 硬币问题](https://codeforces.com/problemset/problem/283/C)

 **评分：** 2100
 **标签：** dp
 **求解时间：** 1m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有`n`硬币类型。 硬币类型`i`有价值`a[i]`，我们可以采用该类型的任意非负数硬币。 

所有选定硬币的总价值必须精确`t`。 

此外，我们还给出了以下形式的不等式约束：`count[b] > count[c]`限制条件很特殊。 每个索引在约束的左侧最多出现一次，在右侧最多出现一次。 事实证明，这个结构是关键的观察结果。 

我们必须计算有多少个向量`(count[1], count[2], ..., count[n])`满足所有不平等并产生总价值`t`。 答案需要模数`1,000,000,007`。 

约束足够大，直接枚举是不可能的。 目标金额达到`10^5`，而币种数量达到`300`。 任何尝试迭代可能的硬币数量的解决方案都会立即爆炸。 目标总和建议采用动态规划解决方案，其复杂度大致与`n * t`， 因为`300 * 100000 = 3 * 10^7`操作仍然可以在优化的代码中进行管理。 

这些不平等引入了几种微妙的情况。 

考虑```
2 2 10
1 1
1 2
2 1
```约束条件要求```
x1 > x2
x2 > x1
```这是不可能的。 正确答案是`0`。 

仅在本地处理约束的粗心实现可能无法检测到这一矛盾。 

另一个例子是更长的周期：```
3 3 20
1 1 1
1 2
2 3
3 1
```这需要```
x1 > x2 > x3 > x1
```这也是不可能的。 

当不平等迫使某些最低贡献已经超过时，就会出现不同的陷阱`t`。 

例如：```
2 1 1
5 5
1 2
```自从`x1 > x2`，最小的有效分配是`(1,0)`， 值得`5`。 达到总价值`1`是不可能的，所以答案是`0`。 

该解决方案必须自动检测所有这些情况。 

## 方法

 暴力方法会尝试每种硬币类型的所有可能计数，并检查总价值是否等于`t`所有不平等都成立。 

即使每枚硬币的价值都是`1`，单个变量可能需要`100000`不同的价值观。 和`300`变量，搜索空间是天文数字。 

这些不平等表明计数不是独立的。 由于每个节点最多出现一次作为源并且最多出现一次作为目的地，因此约束图的形状非常有限。 

创建有向边：```
b -> c
```意义```
count[b] > count[c]
```由于每个顶点最多有入度`1`最多出度`1`，每个连通分量要么是一条链，要么是一个环。 

一个循环立即使系统无法运行：```
x1 > x2 > ... > xk > x1
```所以只有链条才重要。 

现在考虑一条链：```
v1 -> v2 -> ... -> vk
```这意味着```
x1 > x2 > ... > xk
```不要直接存储计数，而是定义新的非负变量：```
y1 = x1 - x2 - 1
y2 = x2 - x3 - 1
...
y(k-1) = x(k-1) - xk - 1
yk = xk
```每个有效的赋值都恰好对应于非负的一个选择`y`值，反之亦然。 

替换后，该链贡献：```
constant + Σ(weight_i * yi)
```常数来自强制`+1`严格不平等所要求的差距。 

所有变量都成为独立的非负变量。 处理完每条链后，整个问题就变成了：

 计算非负解的数量```
Σ(weight_i * yi) = remaining_target
```这正是经典的完整背包计数DP。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| 指数| 太慢了 |
 | 最佳 | O(n·t) | O(t) | 已接受 |

 ## 算法演练

 1. 构建有向图，其中每个约束`b > c`成为边缘`b -> c`。 
2. 存储每个节点的入度和出邻居。 由于输入保证，每个节点最多有入度`1`最多出度`1`。 
3. 从每个有入度的节点开始`0`。 这些节点是链的头。 
4. 从头到尾遍历每条链并按顺序收集其顶点。 
5. 对于有顶点的链```
v1, v2, ..., vk
```计算前缀和```
pref[i] = a[v1] + ... + a[vi]
```6. 添加```
pref[1] + pref[2] + ... + pref[k-1]
```全球强制性缴款`base`。 

这是严格不平等所强制的最小值。 
7. 为每个变换变量创建一个 DP 权重。 

为了`i < k`，系数`yi`是`pref[i]`。 

为了`yk`，系数为`pref[k]`。 
8. 将链中的所有顶点标记为已访问。 
9. 处理完所有根后，检查是否每个顶点都被访问过。 

任何未访问过的顶点都属于一个循环。 在这种情况下，答案是`0`。 
10.让```
T = t - base
```如果`T < 0`， 输出`0`。 
11. 运行完整背包计数 DP。 

初始化：```
dp[0] = 1
```12. 对于每个生成的权重`w`， 履行：```
for s from w to T:
    dp[s] += dp[s - w]
```13. 输出`dp[T]`。 

### 为什么它有效

 在链条内部，转变```
yi = xi - x(i+1) - 1
```删除严格的不等式并用简单的非负变量替换它们。 

有效之间的映射`x`赋值和非负`y`任务是双射的。 没有解丢失，也没有引入无效解。 

替换后，每条链都贡献一个固定的强制值加上独立非负变量的线性组合。 组合所有链产生一个方程```
Σ(weight_i * yi) = T
```计算这样一个方程的非负解就是完全背包计数问题。 由于周期对应于不可能的严格不平等系统，因此拒绝它们是正确的。 因此，每个计数的 DP 状态对应于一种有效的硬币配置，反之亦然。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1000000007

def solve():
    n, q, t = map(int, input().split())
    a = list(map(int, input().split()))

    nxt = [-1] * n
    indeg = [0] * n

    for _ in range(q):
        b, c = map(int, input().split())
        b -= 1
        c -= 1
        nxt[b] = c
        indeg[c] += 1

    visited = [False] * n
    weights = []
    base = 0

    for i in range(n):
        if indeg[i] == 0:
            chain = []
            cur = i

            while cur != -1 and not visited[cur]:
                visited[cur] = True
                chain.append(cur)
                cur = nxt[cur]

            k = len(chain)
            pref = [0] * k

            for j in range(k):
                pref[j] = a[chain[j]]
                if j:
                    pref[j] += pref[j - 1]

            for j in range(k - 1):
                base += pref[j]
                weights.append(pref[j])

            weights.append(pref[k - 1])

    if not all(visited):
        print(0)
        return

    target = t - base
    if target < 0:
        print(0)
        return

    dp = [0] * (target + 1)
    dp[0] = 1

    for w in weights:
        if w > target:
            continue
        for s in range(w, target + 1):
            dp[s] += dp[s - w]
            if dp[s] >= MOD:
                dp[s] %= MOD

    print(dp[target] % MOD)

solve()
```图构造使用每个节点至多有一个传入边和一个传出边的特殊属性。 这使得每个组件都可以表示为一个简单的链或一个循环。 

这`base`变量存储严格不等式强制的最小值。 如果这个最小值已经超过`t`，不存在解。 

生成的`weights`与转换后的非负变量完全对应。 每个权重可以使用任意次，因为相应的变量可以取任何非负值。 这就是为什么完整背包转换以递增顺序迭代总和的原因。 

循环检测很微妙。 每条链都从一个有入度的节点开始`0`。 如果某个顶点之后仍未被访问，则它不能属于链并且必须位于循环内。 这样的组件没有有效的分配。 

## 工作示例

 ### 示例 1

 输入：```
4 2 17
3 1 2 5
4 2
3 4
```图表是：```
3 -> 4 -> 2
```和节点`1`是孤立的。 

链`3 -> 4 -> 2`有价值观`[2,5,1]`。 

| 步骤| 前缀和 |
 | --- | --- |
 | v3 | 2 |
 | v4 | 7 |
 | v2 | 8 |

 生成的权重：```
2, 7, 8
```基础贡献：```
2 + 7 = 9
```孤立节点`1`贡献重量：```
3
```最终数据：

 | 数量 | 价值|
 | --- | --- |
 | 基地| 9 |
 | 目标| 17 - 9 = 8 | 17 - 9 = 8
 | 重量| [2,7,8,3]|

 完整的背包式 DP 准确找到`3`求和的方法`8`，产生答案：```
3
```该轨迹显示了严格的不平等如何成为固定的强制贡献加上自变量。 

### 示例 2

 输入：```
3 2 6
3 1 1
1 2
2 3
```图形：```
1 -> 2 -> 3
```| 步骤| 前缀和 |
 | --- | --- |
 | 1 | 3 |
 | 2 | 4 |
 | 3 | 5 |

 根据：```
3 + 4 = 7
```| 数量 | 价值|
 | --- | --- |
 | 基地| 7 |
 | t | 6 |
 | 剩余目标 | -1 |

 由于剩余目标为负，所以答案为：```
0
```该跟踪显示了强制性最小值已经超过所需总数的情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n·t) | 最多超过完整背包DP`n`生成的权重 |
 | 空间| O(t) | 1 个长度为 DP 的数组`t + 1`|

 和`n ≤ 300`和`t ≤ 100000`，最坏的情况是大约三千万个 DP 更新，这完全符合优化的 Python 的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

MOD = 1000000007

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n, q, t = map(int, input().split())
    a = list(map(int, input().split())

)
    nxt = [-1] * n
    indeg = [0] * n

    for _ in range(q):
        b, c = map(int, input().split())
        b -= 1
        c -= 1
        nxt[b] = c
        indeg[c] += 1

    visited = [False] * n
    weights = []
    base = 0

    for i in range(n):
        if indeg[i] == 0:
            chain = []
            cur = i

            while cur != -1 and not visited[cur]:
                visited[cur] = True
                chain.append(cur)
                cur = nxt[cur]

            pref = []
            s = 0
            for v in chain:
                s += a[v]
                pref.append(s)

            for j in range(len(chain) - 1):
                base += pref[j]
                weights.append(pref[j])

            weights.append(pref[-1])

    if not all(visited):
        return "0"

    target = t - base
    if target < 0:
        return "0"

    dp = [0] * (target + 1)
    dp[0] = 1

    for w in weights:
        for s in range(w, target + 1):
            dp[s] = (dp[s] + dp[s - w]) % MOD

    return str(dp[target])

# provided samples
assert run("4 2 17\n3 1 2 5\n4 2\n3 4\n") == "3", "sample 1"
assert run("3 2 6\n3 1 1\n1 2\n2 3\n") == "0", "sample 2"
assert run("3 2 10\n1 2 3\n1 2\n2 1\n") == "0", "sample 3"

# custom cases
assert run("1 0 5\n1\n") == "1", "single coin type"
assert run("2 0 2\n1 1\n") == "3", "all equal values"
assert run("2 1 1\n5 5\n1 2\n") == "0", "minimum exceeds target"
assert run("2 1 2\n1 1\n1 2\n") == "1", "boundary exact minimum"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 0 5 / 1`|`1`| 单变量完整背包|
 |`2 0 2 / 1 1`|`3`| 硬币等值且计数不受限制 |
 |`2 1 1 / 5 5 / 1 2`|`0`| 最低强制缴款超过目标 |
 |`2 1 2 / 1 1 / 1 2`|`1`| 目标等于最小值的精确边界 |

 ## 边缘情况

 考虑矛盾循环：```
2 2 10
1 2
1 2
2 1
```没有节点有入度`0`，因此不会开始链遍历。 两个顶点都未被访问。 该算法在遍历阶段后检测到这一点并立即返回`0`。 这符合以下事实：`x1 > x2 > x1`是不可能的。 

考虑更长的周期：```
3 3 20
1 1 1
1 2
2 3
3 1
```同样，每个顶点都有入度`1`。 不存在根。 所有顶点都未被访问，答案是`0`。 

考虑低于强制性最低标准的目标：```
2 1 1
5 5
1 2
```链有前缀和`[5,10]`。 强制性供款是`5`，因此剩余目标变为`-4`。 算法返回`0`在运行 DP 之前。 

这些情况正是简单实现经常失败的地方，但它们可以通过链分解和最小贡献转换自然地处理。
