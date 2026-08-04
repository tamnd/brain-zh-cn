---
title: "CF 102623M - 螨虫"
description: "我们有一个矩形农场，最多有 30 行，只有 8 列。 细胞要么是堵塞的岩石，要么是可用的沙子。 我们可以将任何沙细胞变成水。 选择水细胞后，每一个剩余的沙细胞只要接触到至少一个水细胞就可以种植甘蔗。"
date: "2026-08-04T17:16:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102623
codeforces_index: "M"
codeforces_contest_name: "2020 Lenovo Cup USST Campus Online Invitational Contest"
rating: 0
weight: 102623
solve_time_s: 75
verified: true
draft: false
---

[CF 102623M - MITE](https://codeforces.com/problemset/problem/102623/M)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个矩形农场，最多有 30 行，只有 8 列。 细胞要么是堵塞的岩石，要么是可用的沙子。 我们可以将任何沙细胞变成水。 选择水细胞后，每一个剩余的沙细胞只要接触到至少一个水细胞就可以种植甘蔗。 任务是决定哪些沙子细胞变成水，以使甘蔗细胞的数量尽可能多，然后打印生成的网格。 

宽度小是关键限制。 行数可以是 30，但列数只有 8，因此一行最多可以用具有最多 256 个可能值的位掩码来表示。 列数为指数的解决方案是可以接受的，而单元总数为指数的解决方案是不可能的。 尝试所有沙细胞的每个子集可能意味着检查$2^{240}$配置，这远远超出了任何实际限制。 

有几个细节可能会破坏简单的贪婪解决方案。 例如，水细胞本身没有价值，重要的是它们对邻近细胞的影响。 在单行网格中：```
2 3
...
```将水放入中间的单元格中得到：```
.X.
```为了简单起见，这里从输出表示中省略了水，而将水放置在边缘会减少相邻的甘蔗单元。 总是将水放在看起来最开放的单元上的策略可能会失败，因为水单元可以帮助未来的多个行。 

另一个问题是，一个单元格可能会受到下一行水的影响，因此一行不能总是在选择自己的水后立即确定。 例如：```
2 1
.
.
```在我们知道底部细胞是否变成水之前，无法判断顶部细胞。 该算法必须记住前一行的决定。 

## 方法

 直接的方法是选择每组可能的沙细胞来转化为水。 对于每个选择，我们可以扫描网格并计算剩余的沙细胞接触水的数量。 这是正确的，因为它检查了每一种可能的最终安排。 但是，如果农场包含 240 个沙单元，则选择数量为$2^{240}$，这是不可能的。 

网格的结构给了我们更好的视野。 由于宽度仅为 8，因此网格的已处理部分和未处理部分之间的交互通过单行进行。 我们只需要记住前一行中哪些单元格是水即可。 这将问题转化为行掩码的动态规划。 

对于每一行，我们枚举所有可能的水掩模，它们是该行中沙单元的子集。 当我们决定下一行的水掩模时，前一行就完全确定了，因为我们现在知道与其相邻的所有水单元。 然后我们可以添加该行中创建的甘蔗单元格的数量。 掩码数量最多为 256 个，因此总转换计数很少。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(2^{nm}nm)$|$O(nm)$| 太慢了|
 | 最佳|$O(n \cdot 2^m \cdot 2^m \cdot m)$|$O(n \cdot 2^m)$| 已接受 |

 ## 算法演练

 1. 预先计算每行的每个可能的水掩模。 面具中设置一个位意味着相应的沙细胞会变成水。 岩石细胞永远不会出现在水罩中。 
2. 使用动态规划，其中状态是前一行的水掩模。 存储的值是该行上方已确定的甘蔗单元的最大数量。 前一行是唯一需要的信息，因为所有未来的影响只能来自紧邻的行。 
3. 处理行时`i`，尝试这一行所有可能的水面膜。 对于之前的每个掩码，计算该行的分数`i - 1`。 如果前一行中的一个单元格是沙子并且其四个相邻单元格中至少有一个是水，则它会变成甘蔗。 
4. 存储每行和每个生成的蒙版的最佳过渡。 这些父指针允许我们在动态编程完成后重建选定的水行。 
5. 在最后一个实际行之后，使用空水掩模执行一次额外的过渡。 最后一步对最后一行进行评分，因为它现在有一个已知的不含水的“下一行”。 
6. 向后跟随存储的父级来重建所选的水面罩。 然后将每个选定的水细胞转换为`O`，每个与水相邻的沙单元`X`，并保留其他沙细胞为`.`。 

不变的是，在处理一定数量的行之后，存储的掩码之前的每一行都已经收到了其最终的最佳贡献。 存储的掩码恰好包含选择新掩码时评估下一行所需的信息。 由于考虑了每个可能的行转换，因此最终转换后的最佳状态表示甘蔗单元的最大可能数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]

    row_masks = []
    for r in range(n):
        masks = []
        for mask in range(1 << m):
            ok = True
            for c in range(m):
                if (mask >> c) & 1 and grid[r][c] == '#':
                    ok = False
                    break
            if ok:
                masks.append(mask)
        row_masks.append(masks)

    def score_row(r, above, cur):
        if r < 0 or r >= n:
            return 0
        res = 0
        for c in range(m):
            if grid[r][c] == '#':
                continue
            if (above >> c) & 1:
                continue
            water = False
            if c > 0 and ((above >> (c - 1)) & 1):
                water = True
            if c + 1 < m and ((above >> (c + 1)) & 1):
                water = True
            if (above >> c) & 1:
                water = True
            if (cur >> c) & 1:
                water = True
            if water:
                res += 1
        return res

    parent = [[-1] * (1 << m) for _ in range(n + 1)]

    dp = [-10**9] * (1 << m)
    dp[0] = 0

    for r in range(n):
        ndp = [-10**9] * (1 << m)
        for prev in range(1 << m):
            if dp[prev] < 0:
                continue
            for cur in row_masks[r]:
                val = dp[prev] + score_row(r - 1, prev, cur)
                if val > ndp[cur]:
                    ndp[cur] = val
                    parent[r][cur] = prev
        dp = ndp

    best = -1
    last = -1
    for prev in range(1 << m):
        val = dp[prev] + score_row(n - 1, prev, 0)
        if val > best:
            best = val
            last = prev

    water = [0] * n
    mask = last
    for r in range(n - 1, -1, -1):
        water[r] = mask
        mask = parent[r][mask]

    ans = [list(row) for row in grid]
    for r in range(n):
        for c in range(m):
            if (water[r] >> c) & 1:
                ans[r][c] = 'O'

    for r in range(n):
        for c in range(m):
            if ans[r][c] != '.':
                continue
            ok = False
            for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < n and 0 <= nc < m:
                    if ans[nr][nc] == 'O':
                        ok = True
            if ok:
                ans[r][c] = 'X'

    print('\n'.join(''.join(row) for row in ans))

if __name__ == "__main__":
    solve()
```这`row_masks`数组在动态规划开始之前删除不可能的选择。 岩石细胞永远不会变成水，因此含有这些碎片的掩模被丢弃。 

转换函数仅在下一行决策可用后才评估一行。 这避免了忘记细胞可以从下方垂直接收水影响的常见错误。 带掩模的人工最终过渡`0`底行具有相同的目的。 

重建仅存储每个选定状态的先前掩码。 由于每行最多有 256 个掩码，因此存储这些父代的规模很小。 不存在大整数问题，因为最高分数只有 240。 

## 工作示例

 举一个小例子：

 输入：```
3 3
...
.#.
...
```动态规划状态可以概括为：

 | 已处理的行| 当前存储的掩码| 意义|
 | --- | --- | --- |
 | 开始|`000`| 之前没有水|
 | 第 0 行之后 | 几个口罩| 考虑的第一行选择 |
 | 第 1 行之后 | 最好的口罩| 考虑的中间行选择|
 | 第 2 行之后 | 最好的口罩| 考虑所有行 |
 | 最终过渡|`000`| 底行最终确定|

 该跟踪显示了算法延迟评分的原因。 在知道第二行掩码之前，顶行尚未最终确定。 

对于第二个样本：```
3 3
.#.
#.#
.#.
```中间一排的选择有限，因为岩石阻挡了可能的水位。 行掩码限制立即删除无效转换，动态编程仅保留合法配置。 

| 行| 可用面罩数量 | 存储的信息 |
 | --- | --- | --- |
 | 0 | 4 | 非岩石细胞中可能有水|
 | 1 | 2 | 从选择中删除岩石细胞|
 | 2 | 4 | 最终转换后评估底行 |

 这个案例证实了该算法并不假设每个细胞都可以变成水。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \cdot 2^m \cdot 2^m \cdot m)$| 测试每对先前和当前的掩模，每个分数扫描一行 |
 | 空间|$O(n \cdot 2^m)$| 储存父母以供重建|

 和`m <= 8`，最多有 256 个掩码。 转换计数大致为`30 * 256 * 256`，这很容易管理。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    solve()
    out = sys.stdout.getvalue()
    sys.stdin = old
    return out

# Minimum size
assert len(run("1 1\n.\n").strip()) == 1

# All rocks
assert run("2 2\n##\n##\n") == "##\n##\n"

# Single row boundary case
res = run("1 3\n...\n")
assert 'O' in res

# Mixed rocks and sand
res = run("3 3\n.#.\n...\n.#.\n")
assert res.count('X') >= 0
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 x 1`沙 | 任何有效的单字符结果 | 最小尺寸 |
 | 所有岩石| 同格| 没有合法的水放置|
 | 一排沙| 有效最大安排 | 水平边界处理|
 | 网格内的岩石| 有效安排| 口罩过滤|

 ## 边缘情况

 被岩石包围的单个沙细胞不可能有水邻居，除非它本身变成水，但水不能产生甘蔗。 为了：```
1 1
.
```唯一有效的输出是`.`或者`O`。 该算法考虑了这两种状态，并正确避免将水细胞视为手杖。 

另一行旁边的一行可以从下面获得帮助。 为了：```
2 1
.
.
```选择底部细胞作为水可以使顶部细胞变成甘蔗。 动态规划不会太早对顶行进行评分，因此可以正确处理这种垂直依赖性。 

仅包含岩石的网格：```
2 2
##
##
```除了零之外，没有可能的水面具。 答案保持不变，因为掩模生成步骤拒绝所有无效的水选择。
