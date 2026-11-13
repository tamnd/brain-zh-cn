---
title: "CF 28D - 别害怕，DravDe 很友善"
description: "我们有固定的卡车顺序。 对于每辆卡车，我们都知道它的价值、车内的人数以及两个恐惧约束。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dp", "hashing"]
categories: ["algorithms"]
codeforces_contest: 28
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 28 (Codeforces format)"
rating: 2400
weight: 28
solve_time_s: 100
verified: true
draft: false
---
[CF 28D - 别害怕，DravDe 很友善](https://codeforces.com/problemset/problem/28/D)

 **评分：** 2400
 **标签：** 二分查找、数据结构、dp、哈希
 **求解时间：** 1m 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有固定的卡车顺序。 对于每辆卡车，我们都知道它的价值、车内的人数以及两个恐惧约束。 

如果一辆卡车幸存并进入隧道，那么在所有幸存的卡车中：

 - 之前的总人数必须等于`l`- 之后的总人数必须等于`r`我们可以删除卡车的任何子集，但其余卡车的相对顺序不能改变。 我们的目标是最大化幸存卡车的价值总和。 

重要的细节是，约束是根据幸存的人而不是原始位置来表达的。 如果幸存的车队包含载有乘客的卡车：`c[a1], c[a2], ..., c[ak]`然后对于每辆选定的卡车`ai`：

 -`c[a1] + ... + c[a(i-1)] = l[ai]`-`c[a(i+1)] + ... + c[ak] = r[ai]`将两个方程相加得出：`total_people = l[i] + c[i] + r[i]`这是第一个结构观察。 每辆幸存的卡车必须就最终车队内的总人数达成一致。 

约束足够大，二次动态规划是不可能的。 和`n = 10^5`， 一个`O(n^2)`转换计数大约会达到`10^10`操作，远远超出极限。 我们需要一些接近的东西`O(n log n)`。 

棘手的部分是条件是全球性的。 仅当卡车前后的总人数完全匹配时，卡车才有效。 独立检查卡车的简单实现将会失败，因为选择一辆卡车会改变后面每辆卡车看到的前缀和。 

考虑这个例子：```
3
5 2 0 2
5 2 2 0
100 1 0 0
```卡车3单独适用于总人数`1`。 

卡车 1 和 2 一起适用于总人数`4`。 

正确答案仅是卡车 3，因为价值`100`大于`10`。 

总是扩展兼容链的贪婪策略会错误地保留卡车 1 和 2。 

当多辆卡车共享相同的前缀要求时，会出现另一个微妙的情况。```
4
10 1 0 2
1 1 0 2
10 1 1 1
10 1 2 0
```卡车 2 永远不能与卡车 3 共存，因为两者在同一总数中都需要不兼容的前缀。 粗心的 DP 只检查本地兼容性可能会意外地将它们链接在一起。 

还有一种边缘情况，即没有两辆卡车可以共存。```
2
5 1 0 0
7 2 0 0
```每辆卡车单独组成一个有效的车队。 答案应该只选择卡车 2。 

这意味着 DP 自然必须允许从任何卡车开始新的车队。 

## 方法

 暴力方法将枚举卡车的每个子集，保留顺序，计算幸存的前缀和，并验证每个约束。 这是有效的，因为有效性的定义是明确的，但即使`2^40`已经是无望了，而这里`n`达到`10^5`。 

更现实的暴力 DP 会尝试所有前辈。 假设我们从左到右处理卡车并定义：`dp[i] = best value of a valid convoy ending at i`过渡自`j`到`i`，我们需要：

 - 两辆卡车属于同一总人口
 - 之前的人`i`与以前的人平等`j`加`c[j]`这已经表明了链结构。 如果卡车`i`有前缀要求`l[i]`，那么它的前身必须满足：`l[j] + c[j] = l[i]`并且两者必须共享相同的：`T = l + c + r`二次 DP 检查所有之前的卡车`j`对于每一个`i`。 这给出了`O(n^2)`过渡，还是太慢了。 

关键的观察是每个转换仅取决于两个值：

 - 车队总数`T`- 所需的前缀人口`l`假设我们知道固定总数的最佳车队`T`以前缀population结尾`x`。 然后是一辆卡车：

 - 总计`T`- 前缀`l = x + c_prev`可以立即延长。 

这将问题转化为稀疏状态 DP，索引为`(T, l)`。 

对于每辆卡车：

 - 计算`T = l + c + r`- 任何前任都必须有相同的`T`- 前任的结束前缀必须等于`l`所以我们维持：`best[T][prefix] = best achievable state`每个状态存储最大值和重建信息。 

使用哈希图给出平均值`O(1)`过渡，因此整个解决方案变成线性的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力DP | O(n²) | O(n) | 太慢了 |
 | 最优哈希DP | O(n) 平均 | O(n) | 已接受 |

 ## 算法演练

 1. 从左到右处理卡车。 

顺序很重要，因为车队顺序无法更改。 卡车的任何有效前身`i`必须出现在输入的前面。 
2. 对于每辆卡车，计算：```
T = l[i] + c[i] + r[i]
```同一幸存车队内的所有卡车必须共享这个确切的总人口数。 
3.维护DP状态的哈希图。 

对于每个总计`T`，我们存储另一个按前缀人口索引的哈希图。 

一个状态代表：```
best[T][p]
```意味着总人口为的最佳车队`T`其当前前缀人口等于`p`。 
4.仔细解释前缀的含义。 

如果车队在卡车处结束`j`，那么拿下之后，车队累计的总人数就变成：```
l[j] + c[j]
```这将成为下一个兼容卡车所需的前缀。 
5. 卡车用`i`，寻找前驱状态：```
best[T][l[i]]
```因为之前任何车队都由卡车延伸`i`必须已经完全包含`l[i]`人们。 
6. 如果存在这样的状态，则扩展它：```
new_value = previous_value + v[i]
```否则卡车`i`只有在以下情况下才能开始新的车队`l[i] == 0`。 

以卡车开始的车队`i`在它之前没有人。 
7. 新车队以累积前缀结束：```
l[i] + c[i]
```更新：```
best[T][l[i] + c[i]]
```如果新值更好。 
8. 在更新期间存储父指针。 

为了重建，我们保留：

 - 之前的状态
 - 以前的卡车索引
 9. 在所有累积前缀等于的状态中`T`，选择最大值。 

只有当累计人数等于车队总数时，车队才算完整。 

### 为什么它有效

 每个幸存的车队都定义了严格递增的前缀群体序列：```
0,
c[a1],
c[a1]+c[a2],
...
```卡车用`ai`，它前面的人正好等于加上自己的乘客之前的累计人口数。 该值是`l[ai]`。 

DP状态`best[T][p]`代表总人口的最优部分车队`p`已在车队内累积，其最终总数必须为`T`。 

当下一卡车需要时，过渡是合法的`l[i] = p`。 由于车队中的所有卡车共享相同的总数`T`，每个构建的序列都会自动满足前后恐惧条件。 

不会错过任何有效的车队，因为每个车队都可以通过遵循其递增的前缀和来唯一地重建。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    trucks = [None]

    for _ in range(n):
        v, c, l, r = map(int, input().split())
        trucks.append((v, c, l, r))

    # dp[T][prefix] = (best_value, state_id)
    dp = {}

    # state:
    # value, previous_state, truck_index, T, prefix
    states = [None]

    best_final = -1
    best_state = -1

    for i in range(1, n + 1):
        v, c, l, r = trucks[i]

        T = l + c + r

        if T not in dp:
            dp[T] = {}

        cur_map = dp[T]

        best_val = -1
        prev_state = -1

        if l == 0:
            best_val = v

        if l in cur_map:
            prev_val, st_id = cur_map[l]

            if prev_val + v > best_val:
                best_val = prev_val + v
                prev_state = st_id

        if best_val == -1:
            continue

        new_prefix = l + c

        new_state_id = len(states)
        states.append((best_val, prev_state, i, T, new_prefix))

        if (
            new_prefix not in cur_map
            or best_val > cur_map[new_prefix][0]
        ):
            cur_map[new_prefix] = (best_val, new_state_id)

        if new_prefix == T and best_val > best_final:
            best_final = best_val
            best_state = new_state_id

    ans = []

    while best_state != -1:
        value, prev_state, truck_idx, T, prefix = states[best_state]
        ans.append(truck_idx)
        best_state = prev_state

    ans.reverse()

    print(len(ans))
    print(*ans)

solve()
```实现的中心思想是对 DP 状态的解释。 

对于固定的总人口`T`，确定车队内部进度的关键是迄今为止累积的人口。 根据参数选择卡车后`(c, l)`，累计人口变为`l + c`。 

过渡步骤：```
if l in cur_map:
```意味着我们已经构建了一个有效的部分车队，其中包含`l`人们。 卡车`i`接下来可以合法地进行，因为它的恐惧约束恰好需要`l`在它之前的人。 

初始化：```
if l == 0:
    best_val = v
```允许车队从这辆卡车出发。 

一个微妙的点是我们更新状态`new_prefix = l + c`，不为`l`。 新状态描述了插入当前卡车后的车队。 

另一个容易犯的错误是忘记了多条路径可能会导致相同的结果`(T, prefix)`状态。 我们只保留最大值，因为未来的转换仅取决于这两个数字。 任何较弱的状态以后都不会变得最佳。 

重建存储父状态 ID，而不是复制索引数组。 这使记忆保持线性。 

## 工作示例

 ### 示例 1

 输入：```
5
1 1 0 3
1 1 1 2
1 1 2 1
1 1 3 0
2 1 3 0
```所有卡车均配备：```
T = 4
```| 卡车| 我| c | r | 需要状态 | 新前缀 | 最超值|
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 0 | 1 | 3 | 开始 | 1 | 1 |
 | 2 | 1 | 1 | 2 | 前缀 1 | 2 | 2 |
 | 3 | 2 | 1 | 1 | 前缀 2 | 3 | 3 |
 | 4 | 3 | 1 | 0 | 前缀 3 | 4 | 4 |
 | 5 | 3 | 1 | 0 | 前缀 3 | 4 | 5 |

 卡车 5 产生的最终价值比卡车 4 更好，因此最佳车队变为：```
1 2 3 5
```该迹线展示了 DP 状态的含义。 每辆卡车都会扩展车队，其累计人口等于其所需的前缀。 

### 示例 2

 输入：```
3
5 2 0 2
5 2 2 0
100 1 0 0
```| 卡车| T | 需要状态 | 新前缀 | 最超值|
 | --- | --- | --- | --- | --- |
 | 1 | 4 | 开始 | 2 | 5 |
 | 2 | 4 | 前缀 2 | 4 | 10 | 10
 | 3 | 1 | 开始 | 1 | 100 | 100

 存在两个单独的总计。 

为了`T = 4`，最好的车队有价值`10`。 

为了`T = 1`，单车车队有价值`100`。 

该算法正确地比较了所有总数中已完成的车队。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) 平均 | 每辆卡车执行恒定数量的哈希图操作 |
 | 空间| O(n) | 每次成功转换一个 DP 状态 |

 该解决方案很容易满足限制。 和`10^5`对于卡车来说，Python 中使用哈希图的线性处理完全在 2 秒的时间限制内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    out = io.StringIO()
    sys.stdout = out

    import sys
    input = sys.stdin.readline

    def solve():
        n = int(input())

        trucks = [None]

        for _ in range(n):
            v, c, l, r = map(int, input().split())
            trucks.append((v, c, l, r))

        dp = {}
        states = [None]

        best_final = -1
        best_state = -1

        for i in range(1, n + 1):
            v, c, l, r = trucks[i]

            T = l + c + r

            if T not in dp:
                dp[T] = {}

            cur_map = dp[T]

            best_val = -1
            prev_state = -1

            if l == 0:
                best_val = v

            if l in cur_map:
                prev_val, st_id = cur_map[l]

                if prev_val + v > best_val:
                    best_val = prev_val + v
                    prev_state = st_id

            if best_val == -1:
                continue

            new_prefix = l + c

            new_state_id = len(states)
            states.append((best_val, prev_state, i))

            if (
                new_prefix not in cur_map
                or best_val > cur_map[new_prefix][0]
            ):
                cur_map[new_prefix] = (best_val, new_state_id)

            if new_prefix == T and best_val > best_final:
                best_final = best_val
                best_state = new_state_id

        ans = []

        while best_state != -1:
            value, prev_state, truck_idx = states[best_state]
            ans.append(truck_idx)
            best_state = prev_state

        ans.reverse()

        print(len(ans))
        print(*ans)

    solve()

    return out.getvalue().strip()

# provided sample
assert run(
"""5
1 1 0 3
1 1 1 2
1 1 2 1
1 1 3 0
2 1 3 0
"""
) == "4\n1 2 3 5", "sample 1"

# minimum size
assert run(
"""1
10 5 0 0
"""
) == "1\n1", "single truck"

# no compatible pairs
assert run(
"""2
5 1 0 0
7 2 0 0
"""
) == "1\n2", "choose larger single truck"

# chain of three
assert run(
"""3
3 1 0 2
4 1 1 1
5 1 2 0
"""
) == "3\n1 2 3", "full chain"

# competing totals
assert run(
"""3
5 2 0 2
5 2 2 0
100 1 0 0
"""
) == "1\n3", "better separate convoy"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单一有效卡车 |`1 1`| 基本情况初始化 |
 | 两辆不兼容的卡车 | 仅限较大价值的卡车 | 正确启动新车队|
 | 全兼容链| 已选择所有卡车 | DP 转换 |
 | 比赛总分| 全球最佳总分| 分离方式`T`|

 ## 边缘情况

 考虑每辆卡车单独有效但与所有其他卡车不兼容的情况。```
2
5 1 0 0
7 2 0 0
```卡车 1 创建状态：```
T = 1
prefix = 1
value = 5
```卡车 2 创建：```
T = 2
prefix = 2
value = 7
```两者都无法延长对方的时间，因为总数不同。 该算法保留两个已完成的车队，并最终选择较大的值，仅生产卡车 2。 

现在考虑不兼容的前缀要求。```
4
10 1 0 2
1 1 0 2
10 1 1 1
10 1 2 0
```卡车 1 和卡车 2 都创建以下状态：```
T = 3
prefix = 1
```DP 只保留更好的一辆，有价值的卡车 1`10`。 

Truck 3 扩展了该状态：```
value = 20
prefix = 2
```卡车4再次延伸：```
value = 30
prefix = 3
```通过卡车 2 的较弱状态永远不会存在，因为未来的转换仅取决于`(T, prefix)`。 保持最大值就足够了。 

最后，考虑具有不同总数的多个已完成的车队。```
3
5 2 0 2
5 2 2 0
100 1 0 0
```该算法独立构建：

 - 车队`{1,2}`有价值`10`- 车队`{3}`有价值`100`由于已完成的状态是在全球范围内进行比较的，因此正确答案仍然只有卡车 3。
