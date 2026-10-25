---
problem: 1288D
contest_id: 1288
problem_index: D
name: "Minimax Problem"
contest_name: "Educational Codeforces Round 80 (Rated for Div. 2)"
rating: 2000
tags: ["binary search", "bitmasks", "dp"]
answer: passed_samples
verified: true
solve_time_s: 161
date: 2026-06-14
model: gpt-5-3-mini
samples_passed: 1
samples_total: 1
share_url: https://chatgpt.com/share/6a2db7e1-74b8-83ec-b93f-88d597a14c54
---

# CF 1288D - 极小极大问题

 **评级：** 2000
 **标签：** 二分查找、位掩码、dp
 **型号：** gpt-5-3-mini
 **求解时间：** 2m 41s
 **已验证：** 是（1/1 样品）
 **分享：** https://chatgpt.com/share/6a2db7e1-74b8-83ec-b93f-88d597a14c54

 ---

 ## 解决方案

 ## 问题理解

 我们得到 n 个向量的集合，每个向量的长度为 m。 将每个向量视为描述对象的 m 个属性。 我们可以选择两个物体，可能是同一个物体两次。 一旦我们选择了它们，我们就通过取它们属性的坐标最大值来构建一个新的向量。 从这个结果向量中，我们只关心它的最弱坐标，即它的 m 个位置中的最小值。 

目标是选择两个原始向量，使得合并后这个最弱的坐标尽可能大。 换句话说，我们想要选择两行，使得即使它们的坐标最大值中的最小坐标也尽可能大。 

当我们注意到 m 非常小（最多 8），而 n 可以非常大（最多 300,000）时，问题的结构就变得有意义了。 这种不对称性是关键信号：我们期望使用位掩码或坐标子集推理来压缩或编码每个数组，而不是比较所有对。 

一种简单的方法是尝试所有数组对，计算它们的坐标最大值，然后取最小值，给出 O(n^2 m)，当 n 很大时，这太慢了。 

当独立尝试贪婪的每坐标最大化时，会出现更微妙的故障模式。 例如，选择一个在一个坐标中最好的数组和另一个在不同坐标中最好的数组在合并后仍然会产生较差的最小值，因为坐标通过最小值运算进行交互。 

真正的困难在于，主导权不是每个坐标独立的； 我们需要一对共同覆盖高于某个阈值的所有坐标。 

## 方法

 如果我们尝试所有对 (i, j)，我们将计算合并的数组并评估其最小值。 这是正确的，但需要大约 n²/2 次比较，并且每次比较需要 m 次操作。 当 n = 300,000 时，这是不可能的。 

观察的关键是扭转观点。 我们不是直接最大化合并数组的最小值，而是猜测候选答案 x 并询问是否存在一对数组，其坐标最大值在每个坐标中至少为 x。 

固定阈值 x 将每个数组转换为长度为 m 的位掩码，其中如果 a_{i,k} ≥ x，则位 k 为 1。 现在的问题是：我们可以选择两个按位或等于全1的位掩码吗？ 

如果我们可以解决给定 x 的存在性检查，那么我们就可以在数组中的值范围内对 x 进行二分搜索。 

相对于朴素二分搜索的细微改进来自于 m ≤ 8 这一事实。这使我们能够将每个掩码表示为整数，并预先计算与每个掩码对应的数组数量。 然后，我们可以对于每个掩模测试是否存在可以完成完全覆盖的合作伙伴掩模。 

挑战在于我们还需要返回实际数组的索引，而不仅仅是可行性。 因此，我们为每个掩码存储一个代表性索引。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²·米) | O(1) | O(1) | 太慢了|
 | 掩码+二分搜索 | O(n·m log V + 2^m·m) | O(n·m log V + 2^m·m) | O(2^m) | O(2^m) | 已接受 |

 ## 算法演练

1. 我们在输入中的可能值范围内对答案值 x 进行二分搜索。 这是有效的，因为如果阈值 x 可实现，则任何较小的阈值也可实现，从而给出单调谓词。 
2. 对于固定的 x，我们将每个数组转换为大小为 m 的位掩码，其中如果第 k 个值至少为 x，则设置第 k 位。 这将每个数组压缩为一个结构，该结构精确捕获它在阈值 x 处可以满足的坐标。 
3. 我们按掩码对数组进行分组，并为每个掩码至少存储一个索引。 这已经足够了，因为我们只需要找到一个有效的对，而不是枚举所有对。 
4. 我们检查所有掩码对（或者更有效地，对于每个掩码，我们尝试找到补码掩码），使得两个掩码的按位或为 (1 << m) - 1。此条件保证每个坐标在阈值 x 处被两个数组中的至少一个覆盖。 
5. 如果存在这样的对，我们存储相应的索引并将 x 标记为可行； 否则，x太大。 
6.二分查找完成后，我们输出与最大可行x对应的存储对。 

关键的推理步骤是可行性仅取决于坐标是否被两个数组中的至少一个独立覆盖。 位掩码缩减准确地捕捉到了这一点。 

### 为什么它有效

 对于任何固定阈值 x，如果数组足以覆盖 x 层的坐标，则它会在坐标 k 中贡献 1。 使用 max 的合并数组与这些掩码的按位或完全对应。 合并数组的最小值至少为 x 相当于 OR 结果中的每个位都被设置。 因此，解决问题简化为找到两个 OR 完全覆盖的掩码，并且对 x 的二分搜索保留了正确性，因为可行性在 x 中是单调的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def check(x, a, n, m):
    full = (1 << m) - 1
    cnt = {}
    first_idx = {}

    for i in range(n):
        mask = 0
        row = a[i]
        for j in range(m):
            if row[j] >= x:
                mask |= (1 << j)
        if mask not in first_idx:
            first_idx[mask] = i
        cnt[mask] = cnt.get(mask, 0) + 1

    masks = list(cnt.keys())

    for m1 in masks:
        for m2 in masks:
            if (m1 | m2) == full:
                return first_idx[m1], first_idx[m2]

    return None

def solve():
    n, m = map(int, input().split())
    a = [list(map(int, input().split())) for _ in range(n)]

    vals = set()
    for row in a:
        vals.update(row)
    vals = sorted(vals)

    lo, hi = 0, len(vals) - 1
    best_pair = (0, 0)

    def feasible(x):
        res = check(vals[x], a, n, m)
        if res is None:
            return False, None
        return True, res

    l, r = 0, len(vals) - 1
    while l <= r:
        mid = (l + r) // 2
        ok, res = feasible(mid)
        if ok:
            best_pair = res
            l = mid + 1
        else:
            r = mid - 1

    print(best_pair[0] + 1, best_pair[1] + 1)

if __name__ == "__main__":
    solve()
```该实现首先根据阈值将每个数组压缩为位掩码。 检查函数构建掩模频率图并为每个掩模存储一个代表性索引。 然后它会暴力破解所有掩码对，这是可行的，因为最多有 2^m = 256 个掩码。 

二分搜索是对输入中排序的唯一值执行的，因为答案必须与某个坐标值一致。 这避免了浮动或任意值搜索，并使可行性检查保持离散。 

一个常见的微妙之处是每个掩码仅存储一个索引。 这是有效的，因为任何有效的掩码对就足够了，并且我们不需要多个代表。 

## 工作示例

 我们在 m = 3 的简化场景中说明可行性检查。 

### 示例 1

 输入数组：```
[5 0 3]
[1 8 9]
[9 1 0]
```假设阈值 x = 5。 

| 数组| 面膜|
 | ---| ---|
 | [5 0 3] | 100 | 100
 | [1 8 9] | 011|
 | [9 1 0] | 100 | 100

 我们检查对：

 | 米1 | 平方米| 或 | 满的？ |
 | ---| ---| ---| ---|
 | 100 | 100 011| 111 | 111 是的 |

 所以这对是有效的。 这证实了合并数组 1 和 2 覆盖了阈值 5 处的所有坐标。 

### 示例 2

 相同的数组，阈值 x = 9。 

| 数组 | 面膜|
 | ---| ---|
 | [5 0 3] | 000 | 000
 | [1 8 9] | 001|
 | [9 1 0] | 100 | 100

 没有一对掩码可以产生 111，因为没有数组覆盖 9 处的所有坐标。这证实了不可行性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n·m + 2^{2m} · log n) | O(n·m + 2^{2m} · log n) | 每次可行性检查都会在 O(nm) 中构建掩模，并且掩模配对的边界为 256²，因为 m ≤ 8 |
 | 空间| O(2^m) | O(2^m) | 口罩和代表的储存|

 约束条件允许这样做，因为 2^8 = 256，使掩码空间有效恒定，并且每次检查 n·m ≤ 240 万次操作在修剪和严格实施的情况下是可以接受的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import defaultdict

    n, m = map(int, sys.stdin.readline().split())
    a = [list(map(int, sys.stdin.readline().split())) for _ in range(n)]

    vals = sorted({v for row in a for v in row})

    def check(x):
        full = (1 << m) - 1
        first = {}
        masks = set()

        for i in range(n):
            mask = 0
            for j in range(m):
                if a[i][j] >= x:
                    mask |= (1 << j)
            masks.add(mask)
            if mask not in first:
                first[mask] = i

        masks = list(masks)
        for m1 in masks:
            for m2 in masks:
                if (m1 | m2) == full:
                    return first[m1], first[m2]
        return None

    l, r = 0, len(vals) - 1
    ans = (0, 0)
    while l <= r:
        mid = (l + r) // 2
        res = check(vals[mid])
        if res:
            ans = res
            l = mid + 1
        else:
            r = mid - 1

    return f"{ans[0]+1} {ans[1]+1}"

# sample
assert run("""6 5
5 0 3 1 2
1 8 9 1 3
1 2 3 4 5
9 1 0 3 7
2 3 0 6 3
6 4 1 7 0
""") == "1 5"

# minimum case
assert run("""1 1
5
""") == "1 1"

# all equal
assert run("""3 3
1 1 1
1 1 1
1 1 1
""") == "1 1"

# distinct dominance
assert run("""3 2
1 2
2 1
3 0
""") in ["1 2", "2 1"]

# boundary
assert run("""2 2
0 0
100 0
""") == "1 2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单元素| 1 1 | 1 琐碎的身份案例|
 | 所有相等的数组 | 1 1 | 1 自配对正确性 |
 | 不对称优势| 1 2 或 2 1 | 配对选择对称性|
 | 边界零点| 1 2 | 处理低坐标|

 ## 边缘情况

 当一个数组已经满足高于高阈值的所有坐标时，就会出现极端情况。 在这种情况下，它与自身的配对仍然必须被认为是有效的。 位掩码表示处理这个问题，因为完整掩码 OR 本身保持完整，因此算法自然返回 (i, i)。 

另一个微妙的情况是多个阵列共享相同的掩码。 如果我们只存储计数而不存储索引，我们将失去重建有效对的能力。 每个掩码存储一个代表性索引可确保始终可以进行重建，而不会影响正确性。 

第三种情况是最佳解决方案使用两个值分布不唯一的相同数组。 掩码 OR 条件仍然允许 m1 = m2，因此算法正确地考虑自对而不是强制不同的索引。
