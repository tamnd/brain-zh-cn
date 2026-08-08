---
title: "CF 102566D - 政府"
description: "有N个项目，M个城市。 每个项目都必须以两种可能的方式之一执行。 第一个选项被认为是无害的，而第二个选项是有害的。 每个选项都会为每个城市贡献已知数量的资金。"
date: "2026-08-07T21:33:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102566
codeforces_index: "D"
codeforces_contest_name: "AGM 2020, Qualification Round"
rating: 0
weight: 102566
solve_time_s: 54
verified: true
draft: false
---

[CF 102566D - 政府](https://codeforces.com/problemset/problem/102566/D)

 **评级：** -
 **标签：** -
 **求解时间：** 54s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 有`N`项目和`M`城市。 每个项目都必须以两种可能的方式之一执行。 第一个选项被认为是无害的，而第二个选项是有害的。 每个选项都会为每个城市贡献已知数量的资金。 

目标是为每个项目选择一个选项，以便每个城市的总贡献与其所需的预算完全匹配。 在所有有效选择中，我们需要尽可能减少选择有害选项的项目数量。 如果没有一个项目选择能够满足所有城市预算，答案是`impossible`。 

的价值观`N`和`M`都最多为 30。这立即排除了尝试所有可能的项目选择，因为每个项目都有两种状态，并且配置总数为`2^N`。 和`N = 30`，那就是超过十亿种可能性，远远超出了时限内所能检查的范围。 维度`M`也足够小，存储和比较长度为 30 的向量是可行的，因此解决方案应该集中于减少组合数量而不是减少向量维度。 

思考这个问题的一个有用方法是从每个项目的无害选择开始。 这给出了固定的初始支出向量。 对于每个项目，从无害到有害的转换都会增加差异向量。 任务变成找到这些差异向量的子集，其总和恰好是缺失量，同时最小化所选向量的数量。 

有几种边缘情况可能会破坏更简单的解决方案。 仅检查目标向量是否存在但不存储最小数量的有害选择的解决方案可能会返回有效但非最佳的答案。 例如：```
N = 2, M = 1
budget = [2]
project 1: (0, 1)
project 2: (0, 2)
```选择项目2的有害选项，以一种有害选择达到预算，而选择两种有害选项，则以两种有害选择达到预算。 粗心的存在检查也可能返回。 

另一个问题是忘记了有害的选择可能比无害的选择具有更小的成本。 差异向量并不总是正的。 例如：```
N = 1, M = 1
budget = [0]
project 1: (5, 0)
```正确答案是`1`，因为与无害的选择相比，选择有害的选项可以减少 5 的支出。 将有害的选择视为只有积极的增长在这里会失败。 

第三个边缘情况是基本的无害解决方案可能已经满足每个城市的预算：```
N = 1, M = 1
budget = [5]
project 1: (5, 7)
```答案是`0`。 任何强制至少一种有害选择的算法都会产生错误的结果。 

## 方法

 直接的方法是尝试为项目分配所有可能的选项。 对于每个`2^N`分配后，我们计算所有城市的最终支出，检查是否符合预算，并保留最少数量的有害选择。 这种方法是正确的，因为它检查了每一个可能的决定，但最坏的情况需要`2^30`分配，大约有 10.7 亿个状态。 即使每个状态处理得非常快，这也太慢了。 

重要的结构是项目数量只有 30 个。这是中间相遇的典型范围。 我们没有一起处理所有 30 个决策，而是将项目分为两组，每组大约 15 个。每半个只有`2^15 = 32768`可能的选择，这是可以管理的。 

无害的选择被用作起点。 对于每个项目，我们计算选择有害和选择无害之间的差异。 然后，项目子集代表因为这些项目选择有害选项而导致的总变化。 

对于前半部分，我们枚举每个子集并将所得差异向量与所使用的有害选择的数量一起存储。 对于后半部分，我们枚举每个子集并从前半部分中寻找互补向量。 如果所需的总变化是`target`，下半场贡献`s`，那么上半场必须贡献`target - s`。 

通过将上半场最好的比赛与下半场的所有可能性相结合来找到最小有害计数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^N * M) | O(2^N * M) | O(M)| 太慢了 |
 | 中间相遇 | O(2^(N/2) * M) | O(2^(N/2) * M) | O(2^(N/2) * M) | O(2^(N/2) * M) | 已接受 |

 ## 算法演练

 1. 计算每个项目都使用其无害选项的总贡献。 对于每个项目，还计算将该项目更改为有害选项时添加的向量。 最终答案仅取决于选择哪些差异向量。 
2. 通过从所需预算中减去无害总量来计算目标差异向量。 如果无法根据项目差异创建此向量，则不存在有效选择。 
3. 将项目分为两组。 第一组包含大约一半的项目，第二组包含其余的项目。 这减少了指数搜索`2^30`两次搜索的可能性约为`2^15`的可能性。 
4. 枚举第一组的每个子集。 对于每个子集，计算其差异向量之和及其包含的有害选择的数量。 存储每个结果向量的最小有害计数。 仅保留最小值就足够了，因为任何后续组合只关心创建该向量的最便宜的方式。 
5. 枚举第二组的每个子集。 对于每个子集，计算其差异向量和有害计数。 第一组所需的缺失向量是目标向量减去当前第二组向量。 
6. 在存储的图中查找所需的第一组向量。 如果存在，则合并两个有害计数并更新答案。 
7. 如果没有一对子集产生目标向量，则打印`impossible`。 否则打印找到的最小有害计数。 

为什么它有效：

 每一种可能的有害项目的选择都可以唯一地分为上半部分选择的项目和下半部分选择的项目。 两半的枚举都考虑了每一个这样的分割。 对于固定的后半部分选择，查找会准确询问前半部分是否可以产生剩余的所需更改。 由于每个存储的前半矢量仅保留其最小有害计数，因此始终使用该矢量的最佳可能组合。 因此，每个有效的解决方案都会被考虑，并保留最少数量的有害选择。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(n, m, budget, projects):
    base = [0] * m
    diff = []

    for harmful, harmless in projects:
        for j in range(m):
            base[j] += harmless[j]
        diff.append([harmful[j] - harmless[j] for j in range(m)])

    target = tuple(budget[j] - base[j] for j in range(m))

    first = diff[:n // 2]
    second = diff[n // 2:]

    def enumerate_half(arr):
        result = {}
        length = len(arr)
        total = 1 << length

        sums = [(0,) * m]
        counts = [0]

        for mask in range(1, total):
            bit = mask & -mask
            idx = bit.bit_length() - 1
            previous = mask ^ bit
            old = sums[previous]

            cur = tuple(old[j] + arr[idx][j] for j in range(m))
            sums.append(cur)
            counts.append(counts[previous] + 1)

            if cur not in result or counts[-1] < result[cur]:
                result[cur] = counts[-1]

        return result

    left = enumerate_half(first)

    answer = n + 1
    right_len = len(second)
    total = 1 << right_len
    sums = [(0,) * m]
    counts = [0]

    for mask in range(total):
        if mask != 0:
            bit = mask & -mask
            idx = bit.bit_length() - 1
            previous = mask ^ bit
            old = sums[previous]
            cur = tuple(old[j] + second[idx][j] for j in range(m))
            sums.append(cur)
            counts.append(counts[previous] + 1)
        else:
            cur = sums[0]

        need = tuple(target[j] - cur[j] for j in range(m))
        if need in left:
            answer = min(answer, counts[mask] + left[need])

    return "impossible" if answer == n + 1 else str(answer)

def main():
    data = sys.stdin.buffer.read().split()
    if not data:
        return

    it = iter(data)
    t = int(next(it))
    ans = []

    for _ in range(t):
        n = int(next(it))
        m = int(next(it))

        budget = [int(next(it)) for _ in range(m)]

        projects = []
        for _ in range(n):
            harmless = []
            harmful = []
            for _ in range(m):
                x = int(next(it))
                y = int(next(it))
                harmless.append(x)
                harmful.append(y)
            projects.append((harmful, harmless))

        ans.append(solve_case(n, m, budget, projects))

    print("\n".join(ans))

if __name__ == "__main__":
    main()
```实施的第一部分构建无害基线和差异向量。 基线代表在考虑任何有害选择之前已经花费的金额，而每个差异向量描述了使一个项目有害的确切影响。 

这`enumerate_half`函数执行一侧的中间相遇枚举。 数组`sums`存储先前计算的子集总和，以便生成新的子集只需要添加一个项目，而不需要重新计算整个子集。 该字典存储每个向量的最小有害计数，因为多个子集可以产生相同的支出变化。 

在前半部分字典中搜索补语时，会枚举后半部分。 所需向量计算如下`target - current_second_half`。 匹配意味着两个部分一起精确地产生了缺失的支出调整。 

Python 整数不会溢出，因此唯一关心的是内存使用情况。 最多`2^15`存储长度为 30 的向量，这是可以接受的。 使用元组表示是因为元组可以是字典键。 

## 工作示例

 考虑这个小案例：```
1
2 1
2
0 0
0 2
```第一个项目将总数更改为`0`如果变得有害。 第二个改变它`2`。 与无害基线的目标差异是`2`。 

| 步骤| 当前子集 | 差异矢量| 有害计数| 结果 |
 | ---| ---| ---| ---| ---|
 | 上半场| 无 | (0) | 0 | 存储|
 | 上半场| 项目1 | (0) | 1 | 被忽视，因为更糟|
 | 下半场| 无 | (0) | 0 | 需求 (2)，未找到 |
 | 下半场| 项目2 | (2) | 1 | 需求 (0)，已找到 |

 该算法将第二个项目与空的前半子集结合起来，给出了一个有害的选择。 该示例演示了为什么重复向量必须保持最小计数。 

第二个例子：```
1
1 1
5
5 5
```无害基线已经等于预算。 

| 步骤| 当前子集 | 差异矢量| 有害计数| 结果 |
 | ---| ---| ---| ---| ---|
 | 目标计算| 无 | (0) | 0 | 必填|
 | 上半场| 空 | (0) | 0 | 存储|
 | 下半场| 空 | (0) | 0 | 比赛|

 接受空选择，给出答案`0`。 这证实了该算法不会强制做出不必要的有害选择。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(2^(N/2) * M) | O(2^(N/2) * M) | 每一半最多列举`2^15`子集和每个向量运算都涉及`M`城市。 |
 | 空间| O(2^(N/2) * M) | O(2^(N/2) * M) | 前半字典存储所有唯一子集差异向量。 |

 和`N <= 30`和`M <= 30`，该算法每半最多处理约 32768 个子集。 即使对于多个测试用例，这也完全符合限制。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    main()

    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return out.getvalue()

assert run("""1
2 1
2
0 0
0 2
""") == "1\n", "basic possible case"

assert run("""1
1 1
0
5 0
""") == "1\n", "harmful option decreases cost"

assert run("""1
1 1
5
5 7
""") == "0\n", "already satisfied"

assert run("""1
2 2
3 3
1 1 0 0
1 0 0 1
""") == "impossible\n", "unreachable vector"

assert run("""1
30 1
30
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
1 1
""") == "0\n", "maximum number of projects with equal values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 基本可能的情况 |`1`| 正常的中间相遇匹配|
 | 有害降低成本|`1`| 差异向量可能包含负值 |
 | 已经很满意了|`0`| 空子集是有效答案 |
 | 无法到达的矢量|`impossible`| 正确检测无解|
 | 三十个平等项目|`0`| 处理最大项目数 |

 ## 边缘情况

 对于多个子集产生相同差异向量的情况，字典更新仅保留最小的有害计数。 例如：```
1
2 1
2
0 0
0 2
```前半部分可能会从不同的选择中生成相同的向量。 仅存储最佳计数可以防止以后的组合使用更昂贵的表示。 

对于负差异，算法从不假设有害的选择会增加支出。 在：```
1
1 1
0
5 0
```无害基线为 5，目标差异为 -5。 存储的差异向量也是-5，因此正确地找到了有害的选择。 

对于已经满足的基线：```
1
1 1
5
5 7
```目标向量为零。 空子集在枚举期间出现并立即匹配，产生最小可能的有害计数为零。
